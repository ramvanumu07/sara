/**
 * Copy text to clipboard without triggering the "Access other apps and services" permission.
 * Uses the legacy execCommand('copy') path so browsers don't show the Async Clipboard API prompt.
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - true if copy succeeded, false otherwise
 */
export function copyToClipboard(text) {
  if (typeof text !== 'string' || !text) return Promise.resolve(false)

  return new Promise((resolve) => {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '0'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)
      textarea.select()
      textarea.setSelectionRange(0, text.length)
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      resolve(!!ok)
    } catch (e) {
      resolve(false)
    }
  })
}
