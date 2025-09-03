import { applyTextReplacements as _applyTextReplacements } from '@/utils/searchAndReplace'

import { api } from './api'
import { $el } from './ui'

export function clone<T>(obj: T): T {
  try {
    if (typeof structuredClone !== 'undefined') {
      return structuredClone(obj)
    }
  } catch (error) {
    // structuredClone is stricter than using JSON.parse/stringify so fallback to that
  }

  return JSON.parse(JSON.stringify(obj))
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = $el('a', {
    href: url,
    download: filename,
    style: { display: 'none' },
    parent: document.body
  })
  a.click()
  setTimeout(function () {
    a.remove()
    window.URL.revokeObjectURL(url)
  }, 0)
}

export function uploadFile(accept: string) {
  return new Promise<File>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return reject(new Error('No file selected'))
      resolve(file)
    }
    input.click()
  })
}

export function prop<T>(
  target: object,
  name: string,
  defaultValue: T,
  onChanged?: (
    currentValue: T,
    previousValue: T,
    target: object,
    name: string
  ) => void
): T {
  // @ts-expect-error fixme ts strict error
  let currentValue
  Object.defineProperty(target, name, {
    get() {
      // @ts-expect-error fixme ts strict error
      return currentValue
    },
    set(newValue) {
      // @ts-expect-error fixme ts strict error
      const prevValue = currentValue
      currentValue = newValue
      onChanged?.(currentValue, prevValue, target, name)
    }
  })
  return defaultValue
}

export function getStorageValue(id: string) {
  const clientId = api.clientId ?? api.initialClientId
  return (
    (clientId && sessionStorage.getItem(`${id}:${clientId}`)) ??
    localStorage.getItem(id)
  )
}

export function setStorageValue(id: string, value: string) {
  const clientId = api.clientId ?? api.initialClientId
  if (clientId) {
    sessionStorage.setItem(`${id}:${clientId}`, value)
  }
  localStorage.setItem(id, value)
}
