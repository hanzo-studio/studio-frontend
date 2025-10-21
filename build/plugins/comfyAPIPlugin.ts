import path from 'path'
import type { Plugin } from 'vite'

interface ShimResult {
  code: string
  exports: string[]
}

const SKIP_WARNING_FILES = new Set(['scripts/app', 'scripts/api'])

/** Files that will be removed in v1.34 */
const DEPRECATED_FILES = [
  'scripts/ui',
  'extensions/core/maskEditorOld',
  'extensions/core/groupNode'
] as const

function getWarningMessage(
  fileKey: string,
  shimFileName: string
): string | null {
  if (SKIP_WARNING_FILES.has(fileKey)) {
    return null
  }

  const isDeprecated = DEPRECATED_FILES.some((deprecatedPath) =>
    fileKey.startsWith(deprecatedPath)
  )

  if (isDeprecated) {
    return `[ComfyUI Deprecated] Importing from "${shimFileName}" is deprecated and will be removed in v1.34.`
  }

  return `[ComfyUI Notice] "${shimFileName}" is an internal module, not part of the public API. Future updates may break this import.`
}

function isLegacyFile(id: string): boolean {
  return (
    id.endsWith('.ts') &&
    (id.includes('src/extensions/core') || id.includes('src/scripts'))
  )
}

function isFunctionExport(type: string, rest: string) {
  if (type.includes('function')) {
    return true
  }
  if (type === 'const' || type === 'let' || type === 'var') {
    return rest.includes('= (')
  }
  return false
}

function loggingFunctionExport(moduleName: string, name: string) {
  return `export const ${name} = loggingFn('${moduleName}.${name}', window.comfyAPI.${moduleName}.${name});`
}

function isClassExport(type: string) {
  return type === 'class'
}

function loggingClassExport(moduleName: string, name: string) {
  return `export const ${name} = loggingClass('${moduleName}.${name}', window.comfyAPI.${moduleName}.${name});`
}

function transformExports(code: string, id: string): ShimResult {
  const moduleName = getModuleName(id)

  // Regex to match different types of exports
  const regex =
    /export\s+(const|let|var|function|class|async function)\s+([a-zA-Z$_][a-zA-Z\d$_]*)(\s.*|\(.*)\n/g
  const matches = [...code.matchAll(regex)].map((match) => match.slice(0, 4))
  if (!matches.length) {
    return {
      code,
      exports: []
    }
  }
  const names = matches.map(([, , name]) => name)
  // All exports should be bind to the window object as new API endpoint.
  const newCode = `
${code}
window.comfyAPI = window.comfyAPI || {};
window.comfyAPI.${moduleName} = window.comfyAPI.${moduleName} || {};
${names.map((name) => `window.comfyAPI.${moduleName}.${name} = ${name};`).join('\n')}
`
  const exports: string[] = matches.map(([, type, name, rest]) =>
    isFunctionExport(type, rest)
      ? loggingFunctionExport(moduleName, name)
      : isClassExport(type)
        ? loggingClassExport(moduleName, name)
        : `export const ${name} = window.comfyAPI.${moduleName}.${name};`
  )

  return {
    code: newCode,
    exports
  }
}

function getModuleName(id: string): string {
  // Simple example to derive a module name from the file path
  const parts = id.split('/')
  const fileName = parts[parts.length - 1]
  return fileName.replace(/\.\w+$/, '') // Remove file extension
}

export function comfyAPIPlugin(isDev: boolean): Plugin {
  return {
    name: 'comfy-api-plugin',
    transform(code: string, id: string) {
      if (isDev) return null

      if (isLegacyFile(id)) {
        const result = transformExports(code, id)

        if (result.exports.length > 0) {
          const projectRoot = process.cwd()
          const relativePath = path.relative(path.join(projectRoot, 'src'), id)
          const shimFileName = relativePath.replace(/\.ts$/, '.js')
          const fileKey = relativePath.replace(/\.ts$/, '').replace(/\\/g, '/')
          const warningMessage = getWarningMessage(fileKey, shimFileName)
          // It will only display once because it is at the root of the file.
          const warningMessageLog = warningMessage
            ? `console.warn('${JSON.stringify(warningMessage)}', 'First Imported: ' + frames);`
            : ''
          const isDeprecatedConstant = `const MODULE_DEPRECATED = ${warningMessage ? 'true' : 'false'};`

          const shimContent = `// Shim for ${relativePath}
const frames = new Error().stack?.split('\\n');
const immediateCaller = frames?.[1] ?? frames?.[0];
${warningMessageLog}
${isDeprecatedConstant}


function loggingFn(name, fn) {
  const callers = new Set();
  return (...args) => {
    const frames = new Error().stack?.split('\\n');
    const immediateCaller = frames?.[1] ?? frames?.[0];
    if (immediateCaller && !callers.has(immediateCaller)) {
      if (MODULE_DEPRECATED) {
        console.log(name, immediateCaller);
      }
      callers.add(immediateCaller);
    }
    return fn(...args);
  };
}

function loggingClass(name, klazz) {
  const callers = new Set();
  return new Proxy(klazz, {
    construct(target, args) {
      const frames = new Error().stack?.split('\\n');
      const immediateCaller = frames?.[1] ?? frames?.[0];
      if (immediateCaller && !callers.has(immediateCaller)) {
        if (MODULE_DEPRECATED) {
          console.log(name, immediateCaller);
        }
        callers.add(immediateCaller);
      }
      return new target(...args);
    },
  });
}

${result.exports.join('\n')}
`

          this.emitFile({
            type: 'asset',
            fileName: shimFileName,
            source: shimContent
          })
        }

        return {
          code: result.code,
          map: null // If you're not modifying the source map, return null
        }
      }
    }
  }
}
