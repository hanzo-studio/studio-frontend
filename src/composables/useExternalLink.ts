import { computed } from 'vue'

import { electronAPI, isElectron } from '@/utils/envUtil'
import { useI18n } from 'vue-i18n'

/**
 * Composable for building docs.studio.hanzo.ai URLs with automatic locale and platform detection
 *
 * @example
 * ```ts
 * const { buildDocsUrl } = useExternalLink()
 *
 * // Simple usage
 * const changelogUrl = buildDocsUrl('/changelog', { includeLocale: true })
 * // => 'https://docs.studio.hanzo.ai/zh-CN/changelog' (if Chinese)
 *
 * // With platform detection
 * const desktopUrl = buildDocsUrl('/installation/desktop', {
 *   includeLocale: true,
 *   platform: true
 * })
 * // => 'https://docs.studio.hanzo.ai/zh-CN/installation/desktop/macos' (if Chinese + macOS)
 * ```
 */
export function useExternalLink() {
  const { locale } = useI18n()

  const isChinese = computed(() => {
    return locale.value === 'zh' || locale.value === 'zh-TW'
  })

  const platform = computed(() => {
    if (!isElectron()) {
      return null
    }

    const electronPlatform = electronAPI().getPlatform()
    return electronPlatform === 'darwin' ? 'macos' : 'windows'
  })

  /**
   * Build a docs.studio.hanzo.ai URL with optional locale and platform
   *
   * @param path - The path after the domain (e.g., '/installation/desktop')
   * @param options - Options for building the URL
   * @param options.includeLocale - Whether to include locale prefix (default: false)
   * @param options.platform - Whether to include platform suffix (default: false)
   * @returns The complete docs URL
   *
   * @example
   * ```ts
   * buildDocsUrl('/changelog') // => 'https://docs.studio.hanzo.ai/changelog'
   * buildDocsUrl('/changelog', { includeLocale: true }) // => 'https://docs.studio.hanzo.ai/zh-CN/changelog' (if Chinese)
   * buildDocsUrl('/installation/desktop', { includeLocale: true, platform: true })
   * // => 'https://docs.studio.hanzo.ai/zh-CN/installation/desktop/macos' (if Chinese + macOS)
   * ```
   */
  const buildDocsUrl = (
    path: string,
    options: {
      includeLocale?: boolean
      platform?: boolean
    } = {}
  ): string => {
    const { includeLocale = false, platform: includePlatform = false } = options

    let url = 'https://docs.studio.hanzo.ai'

    if (includeLocale && isChinese.value) {
      url += '/zh-CN'
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    url += normalizedPath

    if (includePlatform && platform.value) {
      url = url.endsWith('/') ? url : `${url}/`
      url += platform.value
    }

    return url
  }

  const staticUrls = {
    // Static external URLs
    discord: 'https://hanzo.ai/discord',
    github: 'https://github.com/hanzoai/Hanzo Studio',
    githubIssues: 'https://github.com/hanzoai/Hanzo Studio/issues',
    githubFrontend: 'https://github.com/hanzo-studio/studio-frontend',
    githubElectron: 'https://github.com/hanzo-studio/electron',
    forum: 'https://hanzo.forum/',
    comfyOrg: 'https://hanzo.ai/'
  }

  return {
    buildDocsUrl,
    staticUrls
  }
}
