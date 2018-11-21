import { getData } from './utils.js';

const setPictureSources = function (parentTag, attrName, dataAttrName) {
  for (let i = 0, childTag; (childTag = parentTag.children[i]); i++) {
    if (childTag.tagName === "SOURCE") {
      let attrValue = getData(childTag, dataAttrName);

      setAtrribute(childTag, attrName, attrValue);
    }
  }
};

const setAtrribute = function (element, attrName, value) {
  if (!value) return;

  element.setAttribute(attrName, value);
};

const setSourcesImg = (element) => {
  const srcsetDataName = 'srcset';
  const parent = element.parentNode;
  const sizesDataValue = getData(element, 'sizes');
  const srcsetDataValue = getData(element, srcsetDataName);
  const srcDataValue = getData(element, 'src');

  console.log('setSourcesImg');

  if (parent && parent.tagName === "PICTURE") {
    setPictureSources(parent, "srcset", srcsetDataName);
  }

  setAtrribute(element, "sizes", sizesDataValue);
  setAtrribute(element, "srcset", srcsetDataValue);
  setAtrribute(element, "src", srcDataValue);
};

export const setSourcesBgImage = (element) => {
  const srcDataValue = getData(element, 'src');
  const bgDataValue = getData(element, 'bg');

  if (srcDataValue) {
    let setValue = srcDataValue;
    element.style.backgroundImage = `url("${setValue}")`;
  }

  if (bgDataValue) {
    let setValue = bgDataValue;
    element.style.backgroundImage = setValue;
  }
};

const setSourcesFunctions = {
  IMG: setSourcesImg,
  // 	IFRAME: setSourcesIframe,
  // 	VIDEO: setSourcesVideo
};

export const setSources = (element) => {
  const tagName = element.tagName;
  const setSourcesFunction = setSourcesFunctions[tagName];

  if (setSourcesFunction) {
    setSourcesFunction(element);
    return;
  }
  setSourcesBgImage(element);
};
