import * as sound from './music';

// window.scrollTo(0, document.body.scrollHeight)

const objSound = {
  0: sound.SiaUnstoppable,
  1: sound.forest,
  2: sound.mountain,
  3: sound.summer,
}

const music = document.getElementById('musicId')

const start = document.getElementById('startBtn')
const userSecondInput = document.getElementById('userSecondInput')
const userMinuteInput = document.getElementById('userMinuteInput')
const seconds = document.getElementById("seconds")
const minutes = document.getElementById("minutes")
const spanTimerBlock = document.getElementById('spanTimerBlock');

const staticMin = document.getElementById("staticMin")
const alertMessage = document.getElementById("alert")
const semicolon = document.querySelector(".semicolon")
const btnReset = document.querySelector('.btnReset')
const title = document.getElementById('title');
const cards = document.querySelector('.getcard').children
const resetCardsBtn = document.getElementById('resetCardsBtn');
const btnShowCards = document.getElementById('btnShowCards')
const allCardsBlock = document.getElementById('allCardsBlock')

let storage;
let intervalId, currentTime = 0;
let pauseTime = 0;
let staticTime;
let objValue = {};
let objStorage = {};
let objFromStore = {};
let objCards = {};
let objCardsFromStore = {};


let currentEventKey, prevEventKey;
let prevSelectionSec, currentSelectionSec;
let prevSelectionMin, currentSelectionMin;

document.addEventListener('keyup', inputKeyEnter)
userSecondInput.addEventListener('input', funcSecInput)
userMinuteInput.addEventListener('input', funcMinInput)
start.addEventListener('click', timerStart)
staticMin.addEventListener('click', userBtnStaticValue);
resetCardsBtn.addEventListener('click', resetObjCards)

btnShowCards.addEventListener('click', () => {
  if (btnShowCards.innerText === 'Show Cards ⇣') {
    btnShowCards.innerText = 'Hide Cards ⇡';
  } else {
    btnShowCards.innerText = 'Show Cards ⇣';
  }
  allCardsBlock.classList.toggle('cardsHidden')
  resetCardsBtn.classList.toggle('cardsHidden')

  window.scrollTo(0, document.body.scrollHeight)
})


musicModule();
checkStorage();
setCardsFromStorage()

function setCardsFromStorage() {

  // if (Object.keys(objCardsFromStore).length !== 0) {
  if (objCardsFromStore !== null) {
    objCards = objCardsFromStore;

    Array.from(cards).forEach((card, index) => {
      if (objCardsFromStore[index] === true) {
        card.classList.toggle('imgAnimation')
        card.classList.toggle('blackImg')
      }
      if (objCardsFromStore[index] === true && resetCardsBtn.classList.value.includes('hideResetCardsBtn')) {
        resetCardsBtn.classList.remove('hideResetCardsBtn');
        resetCardsBtn.classList.add('btnAnimation');

      }

      // Прослушка после карточек из storage
      card.addEventListener('click', () => {
        card.classList.toggle('imgAnimation')
        card.classList.toggle('blackImg')
        createObjCards(card, index, objCards)
      })

    })
  } else {
    setObjCards()
  }

}

function setObjCards() {

  Array.from(cards).forEach((card, index) => {
    createObjCards(card, index, objCards)

    card.addEventListener('click', () => {
      card.classList.toggle('imgAnimation')
      card.classList.toggle('blackImg')
      createObjCards(card, index, objCards)
    })
  })
}

function createObjCards(card, index, obj) {
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

  storageSaveCards();
}

function storageSaveTime() {

  objStorage = {
    currentTime: currentTime,
    inputValueSec: userSecondInput.value,
    inputValueMin: userMinuteInput.value,
  }
  localStorage.setItem('objStorage', JSON.stringify(objStorage))
}

function storageSaveCards() {

  localStorage.setItem('objStorageCards', JSON.stringify(objCards))
}

function checkStorage() {
  objFromStore = localStorage.getItem('objStorage')
  objFromStore = JSON.parse(objFromStore)

  objCardsFromStore = localStorage.getItem('objStorageCards')
  objCardsFromStore = JSON.parse(objCardsFromStore);


  if (objFromStore !== null) {
    storage = objFromStore.currentTime;
  }
  if (storage > 0) {
    objValue.userMinuteInput = '';
    objValue.userSecondInput = '';
    currentTime = storage
    pauseApp();
    getInputSmall()
  } else { resetApp() }
}

function resetObjCards() {

  objCards = {};
  localStorage.removeItem('objStorageCards')
  resetCardsBtn.classList.add('hideResetCardsBtn');

  Array.from(cards).forEach(card => {
    card.classList.add('blackImg')
    card.classList.remove('imgAnimation')
  })

}

function musicModule() {
  const musicSelect = document.getElementById('musicSelect')
  const customVolume = document.getElementById('customVolume')

  music.volume = customVolume.value;

  customVolume.onchange = () => {
    music.volume = customVolume.value;
  }

  musicSelect.onchange = () => {
    let sel = musicSelect.selectedIndex;
    for (let key in objSound) {
      if (+sel === +key) {
        music.setAttribute('src', objSound[key])
      }
    }
    // let selOption = musicSelect.options;
    // music.setAttribute('src', selOption[sel].value)
    // music.src = selOption[sel].value;
  }
}

function getInputSmall() {
  userMinuteInput.setAttribute('disabled', true)
  userSecondInput.setAttribute('disabled', true)
  userMinuteInput.classList.add('smallInput');
  userSecondInput.classList.add('smallInput');
  userMinuteInput.classList.remove('bigInput');
  userSecondInput.classList.remove('bigInput');
}

function userBtnStaticValue() {
  resetApp();
  start.removeEventListener('click', resetApp)
  staticTime = 51 * 60 * 1000;
  userMinuteInput.value = "51";
  userSecondInput.value = "00";
  objValue.userMinuteInput = "51";
  objValue.userSecondInput = "00";
}

function funcSecInput() {
  let value = userSecondInput.value
  let maxLength = userSecondInput.maxLength
  if (value.length > maxLength) {
    userSecondInput.value = value.slice(0, maxLength);
  }
  if (value < 0 || value > 59) userSecondInput.value = '';

  if (isNaN(+userSecondInput.value) && value.length === 1) {
    userSecondInput.value = ''
  }
  if (isNaN(+userSecondInput.value) && value.length === 2) {
    userSecondInput.value = value.slice(0, 1);
  }

  objValue = {
    ...objValue,
    userSecondInput: value
  }
}

function funcMinInput() {

  let value = userMinuteInput.value
  let maxLength = userMinuteInput.maxLength
  if (value.length > maxLength) {
    userMinuteInput.value = value.slice(0, maxLength);
  }
  if (value < 0 || value > 100) userMinuteInput.value = '';

  if (isNaN(+userMinuteInput.value) && value.length === 1) {
    userMinuteInput.value = ''
  }
  if (isNaN(+userMinuteInput.value) && value.length === 2) {
    userMinuteInput.value = value.slice(0, 1);
  }

  if (value.length === 2) {
    userSecondInput.focus();
  }

  objValue = {
    ...objValue,
    userMinuteInput: value
  }

}

function inputKeyEnter(event) {

  prevEventKey = currentEventKey
  currentEventKey = event.key

  if (event.target === userSecondInput) {
    prevSelectionSec = currentSelectionSec
    currentSelectionSec = event.target.selectionStart
  }
  if (event.target === userMinuteInput) {
    prevSelectionMin = currentSelectionMin
    currentSelectionMin = event.target.selectionStart
  }

  // console.log(event.target.selectionStart);
  // console.log(event.target.selectionEnd);

  // console.log('prevSelection', prevSelectionMin);
  // console.log('currentSelection', currentSelectionMin);

  // console.log('prevEventKey', prevEventKey);
  // console.log('currentEventKey', currentEventKey);

  //   event.target.selectionStart = 1
  //   event.target.selectionEnd = 1

  if (+event.key >= 0 && +event.key < 9 && userMinuteInput.value.length === 0 && userSecondInput !== document.activeElement) {
    userMinuteInput.focus()
  }

  if (userMinuteInput === document.activeElement && event.key === 'ArrowRight' && userMinuteInput.value.length === 0) {
    userSecondInput.focus()
  }

  if (userSecondInput === document.activeElement && event.key === 'ArrowLeft' && userSecondInput.value.length === 0) {
    userMinuteInput.focus()
  }

  if (userMinuteInput.value.length === 1 && event.key === 'ArrowRight') {
    userSecondInput.focus()
  }

  if (userMinuteInput.value.length === 2 && event.key === 'ArrowRight' && userMinuteInput === document.activeElement && prevEventKey === 'ArrowRight' && prevSelectionMin === 2) {
    userSecondInput.setSelectionRange(0, 0);
    userSecondInput.focus()
  }

  if (userSecondInput === document.activeElement && event.key === "ArrowLeft" && event.target.selectionStart === 0 && prevEventKey === 'ArrowLeft' && prevSelectionSec === 0) {
    userMinuteInput.focus()
    event.target.selectionStart = 1
    event.target.selectionEnd = 1
  }

  if (event.key === 'Enter' || event.code === 'Space') {
    if (currentTime === 0) setNewTime();
    event.preventDefault();
    start.click();
  }
  if (event.key === "Backspace" && userSecondInput.value.length === 0 && prevSelectionSec === 0) {
    userMinuteInput.focus()
  }
  if (event.key === 'Escape') {
    resetApp();
  }
}

function inputCorrection() {

  userMinuteInput.value = userMinuteInput.value.trim();
  userSecondInput.value = userSecondInput.value.trim();

  if (userMinuteInput.value.length === 0) {
    userMinuteInput.value = '00';
  }
  if (userSecondInput.value.length === 0) {
    userSecondInput.value = '00';
  }
  if (userSecondInput.value.length === 1) {
    userSecondInput.value = '0' + userSecondInput.value;
  }
  if (userMinuteInput.value.length === 1) {
    userMinuteInput.value = '0' + userMinuteInput.value;
  }

}

function setNewTime() {

  userMinuteInput.value = objValue.userMinuteInput;
  userSecondInput.value = objValue.userSecondInput;
  currentTime = (+objValue.userMinuteInput) * 60 * 1000 + (+objValue.userSecondInput) * 1000;

  if (!storage && currentTime) { inputCorrection(); } else {
    if (currentTime && Object.keys(objFromStore).length !== 0) {
      userMinuteInput.value = objFromStore.inputValueMin;
      userSecondInput.value = objFromStore.inputValueSec;
      inputCorrection()
    }
  }

}

function removeListener() {
  start.removeEventListener('click', timerStart)
  start.removeEventListener('click', resetApp)
  start.removeEventListener('click', pauseApp)
}

function timerStart() {


  if (staticTime) {
    currentTime = staticTime
  } else { setNewTime(); }

  removeListener();
  setTimeout(() => alertMessage.classList.add('alertHidden'), 6000)

  if (pauseTime && pauseTime > 0) {
    currentTime = pauseTime
  }

  if (currentTime > 0) {

    inputCorrection()
    getInputSmall()

    if (currentTime && Object.keys(objFromStore).length !== 0) {
      userMinuteInput.value = objFromStore.inputValueMin;
      userSecondInput.value = objFromStore.inputValueSec;
      inputCorrection()
    }

    btnReset.classList.add('btnReset')
    start.classList.remove('btn-primary')
    start.classList.add('btn-warning')
    start.innerText = 'Pause'

    start.addEventListener('click', pauseApp)

    function playMusic() {
      console.log(music);
      music.play();
      start.innerText = 'Reset'
      start.classList.remove('btn-warning')
      start.classList.add('btn-danger')
      start.removeEventListener('click', timerStart)
      start.removeEventListener('click', pauseApp)
      start.addEventListener('click', resetApp)
      semicolon.classList.add('spanHidden');
      minutes.innerText = "";
      if (!staticTime) {
        seconds.innerText = 'Timer is stopped'
      } else { seconds.innerText = '' }
    }


    intervalId = setInterval(() => {
      currentTime -= 1000
      calcTime();
      storageSaveTime();
      if (currentTime < 1000) {
        playMusic()
        clearInterval(intervalId)
      }
    }, 1000);
  } else {
    alertMessage.classList.remove('alertHidden');
    start.addEventListener('click', timerStart);
  }
}

function calcTime() {
  const userMinutes = Math.floor(currentTime / 1000 / 60);
  const userSeconds = (currentTime) / 1000 - userMinutes * 60;

  if (userMinutes < 10) {
    minutes.innerText = "0" + userMinutes;
  } else { minutes.innerText = userMinutes; }

  semicolon.classList.remove('spanHidden');

  if (userSeconds < 10) {
    seconds.innerText = "0" + userSeconds;
  } else { seconds.innerText = userSeconds; }

  title.innerText = 'Timer ' + minutes.innerText + ':' + seconds.innerText;
  spanTimerBlock.style.opacity = "1";
}

function pauseApp() {

  inputCorrection()

  if (currentTime && Object.keys(objFromStore).length !== 0) {
    userMinuteInput.value = objFromStore.inputValueMin;
    userSecondInput.value = objFromStore.inputValueSec;
    inputCorrection()
  }

  pauseTime = currentTime;

  if (currentTime > 0) {
    calcTime();
    btnReset.classList.remove('btnReset')

    btnReset.addEventListener('click', resetApp)
    clearInterval(intervalId)

    start.classList.remove('btn-primary')
    start.classList.add('btn-warning')

    start.innerText = 'Continue'
    start.addEventListener('click', timerStart)
    storageSaveTime();

    return;
  }
}

function resetApp() {

  userMinuteInput.removeAttribute('disabled')
  userSecondInput.removeAttribute('disabled')
  userMinuteInput.classList.remove('smallInput');
  userSecondInput.classList.remove('smallInput');
  userMinuteInput.classList.add('bigInput');
  userSecondInput.classList.add('bigInput');

  spanTimerBlock.style.opacity = "0";
  title.innerText = 'Timer';
  clearInterval(intervalId)

  pauseTime = 0;
  staticTime = 0;
  currentTime = 0;

  userSecondInput.value = '';
  userMinuteInput.value = '';

  objValue.userMinuteInput = '';
  objValue.userSecondInput = '';

  userMinuteInput.focus()

  seconds.innerText = '';
  minutes.innerText = '';
  objFromStore = {};

  localStorage.removeItem('objStorage')
  music.pause()
  start.innerText = 'Start'
  semicolon.classList.add('spanHidden');
  btnReset.classList.add('btnReset')
  start.classList.remove('btn-warning')
  start.classList.remove('btn-danger')
  start.classList.add('btn-primary')

  btnReset.removeEventListener('click', resetApp)
  start.removeEventListener('click', resetApp)
  start.removeEventListener('click', pauseApp)
  start.addEventListener('click', timerStart)

  return
}





