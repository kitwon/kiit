const webPrefix = ['moz', 'ms', 'webkit']

function requestAnimationPolyfill() {
  let lastTime = 0
  return function raf(callback) {
    const currTime = new Date().getTime
    const timetoCall = Math.max(0, 16 - (currTime - lastTime))
    const id = window.setTimeout(function cb() {
      const time = currTime + timetoCall
      callback(time)
    }, timetoCall)
    lastTime = currTime + timetoCall
    return id
  }
}

export default function getRequestAnimationFrame() {
  if (typeof window === 'undefined') {
    return () => {}
  }

  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame.bind(window)
  }

  const prefix = webPrefix.filter(key => `${key}RequestAnimationFrame` in window)[0]
  return prefix ? window[`${prefix}RequestAnimationFrame`] : requestAnimationPolyfill()
}

export function cancelRequestAnimationFrame(id) {
  if (typeof window === 'undefined') {
    return null
  }
  if (window.cancelAnimationFrame) {
    return window.cancelAnimationFrame(id)
  }
  const prefix = webPrefix.filter(key =>
    `${key}CancelAnimationFrame` in window || `${key}CancelRequestAnimationFrame` in window
  )[0]

  return prefix
    ? (window[`${prefix}CancelAnimationFrame`] || window[`${prefix}CancelRequestAnimationFrame`]).call(this, id)
    : clearTimeout(id)
}
