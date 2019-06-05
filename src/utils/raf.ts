const webPrefix = ['moz', 'ms', 'webkit'];

function requestAnimationPolyfill(): Function {
  let lastTime = 0;
  return function raf(callback: any): WindowTimers {
    const currTime = new Date().getTime();
    const timetoCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout((): void => {
      const time = currTime + timetoCall
      callback(time)
    }, timetoCall);
    lastTime = currTime + timetoCall;
    return id;
  };
}

export default function getRequestAnimationFrame(): Function {
  if (typeof window === 'undefined') {
    return (): void => {};
  }

  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame.bind(window);
  }

  const prefix = webPrefix.filter((key): boolean => `${key}RequestAnimationFrame` in window)[0];
  return prefix ? (window as any)[`${prefix}RequestAnimationFrame`] : requestAnimationPolyfill();
}

export function cancelRequestAnimationFrame(id: number): any {
  if (typeof window === 'undefined') {
    return null;
  }
  if (window.cancelAnimationFrame) {
    return window.cancelAnimationFrame(id);
  }
  const prefix = webPrefix.filter((key): boolean => `${key}CancelAnimationFrame` in window || `${key}CancelRequestAnimationFrame` in window,)[0];

  return prefix
    ? ((window as any)[`${prefix}CancelAnimationFrame`] || (window as any)[`${prefix}CancelRequestAnimationFrame`]).call(null, id)
    : clearTimeout(id);
}
