const getLikes = () => {
  const likesEl = document.querySelector('[aria-label^="like this video along with"]') || document.querySelector('[aria-label$="likes"]');
  if (!likesEl) {
    throw new Error('Likes DOM element not found');
  }
  let likes = likesEl.getAttribute("aria-label");
  likes = likes.replace(/\D/g, '') * 1;
  return likes;
}

const getViews = () => {
  const infoContainerEl = document.querySelector('#above-the-fold #description-inner #info-container');
  const found = infoContainerEl.innerText.match(/([^\s]*) views/);
  if (found === null) {
    throw new Error('Views DOM element not found');
  }
  const displayedNumber = found[1];
  let views;
  if (displayedNumber[displayedNumber.length - 1] === 'K') {
    const a = parseFloat(displayedNumber.substring(0, displayedNumber.length - 1));
    views = a * 1000;
  } else if (displayedNumber[displayedNumber.length - 1] === 'M') {
    const a = parseFloat(displayedNumber.substring(0, displayedNumber.length - 1));
    views = a * 1000000;
  } else if (displayedNumber[displayedNumber.length - 1] === 'B') {
    const a = parseFloat(displayedNumber.substring(0, displayedNumber.length - 1));
    views = a * 1000000000;
  } else {
    views = parseInt(displayedNumber);
  }
  return views;
};

/**
 * For the provided DOM element, find a text node in its subtree that contains
 * text.
 *
 * @param {*} el
 * @returns
 */
const getElementToInsertInto = el => {
  const childNodes = [...el.childNodes];
  for (let node of childNodes) {
    const isTextNode = node.nodeType === Node.TEXT_NODE;
    if (isTextNode) {
      const hasText = node.textContent.trim();
      if (hasText) {
        return node;
      }
    }
    const elementToInsertInto = getElementToInsertInto(node);
    if (elementToInsertInto !== null) {
      return elementToInsertInto;
    }
  }
  return null;
}

const displayLikeRate = () => {
  let infoEl, likes, views;
  const intervalId = setInterval(() => {
    const el = getElementToInsertInto(document.querySelector('#above-the-fold #title'));
    if (!el) {
      return;
    }
    try {
      likes = getLikes();
    } catch (e) {
      return;
    }
    try {
      views = getViews();
    } catch (e) {
      return;
    }
    const rate = Math.round(getLikes() / getViews() * 1000) / 10;
    el.nodeValue = el.nodeValue + ` | Like rate: ${rate}%`;
    clearInterval(intervalId);
  }, 300);
};

displayLikeRate();