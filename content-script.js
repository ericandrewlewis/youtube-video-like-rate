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

const displayLikeRate = () => {
  let infoEl, likes, views;
  const intervalId = setInterval(() => {
    infoEl = document.querySelector('#above-the-fold #info');
    if (!infoEl) {
      return;
    }
    try {
      likes = getLikes();
    } catch(e) {
      return;
    }
    try {
      views = getViews();
    } catch(e) {
      return;
    }
    const span = document.createElement('span');
    const rate = Math.round(getLikes() / getViews() * 1000) / 10;
    span.innerHTML = `Like rate: ${rate}%`;
    infoEl.after(span);
    clearInterval(intervalId);
  }, 300);
};

displayLikeRate();