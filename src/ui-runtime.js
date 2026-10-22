import autoAnimate from '@formkit/auto-animate';

window.HerbalAutoAnimate = (element, options = {}) => {
  if (!element) return () => {};
  const controller = autoAnimate(element, {
    duration: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 220,
    easing: 'ease-out',
    ...options,
  });
  return () => {
    if (typeof controller === 'function') controller();
    else controller?.destroy?.();
  };
};