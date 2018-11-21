const runningOnBrowser = typeof window !== "undefined";

export const isBot =
  (runningOnBrowser && !("onscroll" in window)) ||
  /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

export const supportsIntersectionObserver =
  runningOnBrowser && "IntersectionObserver" in window;

export const getData = (element, attribute) => {
  return element.getAttribute('data-' + attribute);
};
