
const allCardsBlock = document.getElementById('allCardsBlock')

export default function showCards(btnShowCards) {
  if (btnShowCards.innerText === 'Show Cards ⇣') {
    btnShowCards.innerText = 'Hide Cards ⇡';
  } else {
    btnShowCards.innerText = 'Show Cards ⇣';
  }
  allCardsBlock.classList.toggle('cardsHidden')
  resetCardsBtn.classList.toggle('cardsHidden')

  window.scrollTo(0, document.body.scrollHeight)
}