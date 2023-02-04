
export default function createObjCards(card, index, obj) {
  if (card.classList.value.includes('imgAnimation')) {
    obj[index] = true
    resetCardsBtn.classList.remove('hideResetCardsBtn');
    resetCardsBtn.classList.add('btnAnimation');
    window.scrollTo(0, document.body.scrollHeight);
  } else {

    obj[index] = false

    let marker = true;

    for (let key in obj) {
      if (obj[key] === true) {
        marker = false
      }
    }

    if (marker) {
      resetCardsBtn.classList.add('hideResetCardsBtn');
    }
  }

  localStorage.setItem('objStorageCards', JSON.stringify(obj))
}