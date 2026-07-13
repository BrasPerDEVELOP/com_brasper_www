import { onScopeDispose, unref, watchEffect, type MaybeRef } from 'vue'

/**
 * Inserta (y mantiene reactivo) un bloque JSON-LD en el <head>.
 * Cada bloque se identifica con `key` mediante data-jsonld para poder
 * actualizarlo o eliminarlo sin tocar otros bloques. Si `data` es null,
 * el bloque se elimina. Al desmontar el componente se limpia solo.
 */
export function useJsonLd(key: string, data: MaybeRef<Record<string, unknown> | null>) {
  if (typeof document === 'undefined') return

  const selector = `script[type="application/ld+json"][data-jsonld="${key}"]`

  watchEffect(() => {
    const value = unref(data)
    let element = document.head.querySelector<HTMLScriptElement>(selector)

    if (!value) {
      element?.parentNode?.removeChild(element)
      return
    }

    if (!element) {
      element = document.createElement('script')
      element.type = 'application/ld+json'
      element.setAttribute('data-jsonld', key)
      document.head.appendChild(element)
    }

    element.textContent = JSON.stringify(value)
  })

  onScopeDispose(() => {
    const element = document.head.querySelector(selector)
    element?.parentNode?.removeChild(element)
  })
}
