

const music = document.getElementById('musicId')
const musicSelect = document.getElementById('musicSelect')
const customVolume = document.getElementById('customVolume')

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

let intervalId, timeoutId, currentTime = 0;
let pauseTime = 0;
let staticTime;
let objValue = {};

musicModule();

function musicModule() {
  music.volume = customVolume.value;

  customVolume.onchange = () => {
    music.volume = customVolume.value;
  }

  musicSelect.onchange = () => {
    let sel = musicSelect.selectedIndex;
    let selOption = musicSelect.options;
    music.setAttribute('src', selOption[sel].value)
  }
}

checkStorage();

function checkStorage() {
  const storage = localStorage.getItem('currentTime')
  if (storage > 0) {
    currentTime = storage
    pauseApp();
    userMinuteInput.focus();
  } else { resetApp() }
}

start.addEventListener('click', timerStart)
// userSecondInput.addEventListener('keypress', inputKeyEnter)
document.addEventListener('keydown', inputKeyEnter)

staticMin.addEventListener('click', () => {
  resetApp();
  start.removeEventListener('click', resetApp)
  staticTime = 51 * 60 * 1000;
  userMinuteInput.value = "51";
  userSecondInput.value = "00";
  objValue.userMinuteInput = "51";
  objValue.userSecondInput = "00";
  console.log('staticMin', staticTime);
});

userSecondInput.addEventListener('input', funcSecInput)
userMinuteInput.addEventListener('input', funcMinInput)

function funcSecInput() {
  let value = userSecondInput.value
  let maxLength = userSecondInput.maxLength
  if (value.length > maxLength) {
    userSecondInput.value = value.slice(0, maxLength);
  }
  if (value < 0 || value > 59) userSecondInput.value = '';

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
  if (value < 0 || value > 59) userMinuteInput.value = '';

  if (value.length === 2) userSecondInput.focus();
  objValue = {
    ...objValue,
    userMinuteInput: value
  }

}

function inputKeyEnter(event) {
  // event.stopPropagation();
  // event.stopImmediatePropagation();
  // event.preventDefault();

  if (+event.key >= 0 && +event.key < 9 && userMinuteInput.value.length === 0) {
    userMinuteInput.focus()
  }

  if (event.key === 'Enter' || event.code === 'Space') {
    if (currentTime === 0) setNewTime();
    event.preventDefault();
    start.click();
  }
  if (event.key === "Backspace" && userSecondInput.value.length === 0) {
    userMinuteInput.focus()
  }
  if (event.key === 'Escape') {
    resetApp();
  }
}

function setNewTime() {
  userMinuteInput.value = objValue.userMinuteInput;
  userSecondInput.value = objValue.userSecondInput;
  // currentTime = userMinuteInput.value * 60 * 1000 + userSecondInput.value * 1000;
  currentTime = (+objValue.userMinuteInput) * 60 * 1000 + (+objValue.userSecondInput) * 1000;
}

function removeListener() {
  start.removeEventListener('click', timerStart)
  start.removeEventListener('click', resetApp)
  start.removeEventListener('click', pauseApp)
}

function timerStart() {

  console.log('timerStart', staticTime);

  if (staticTime) {
    currentTime = staticTime
  } else {
    setNewTime();
  }

  removeListener();
  setTimeout(() => alertMessage.classList.add('alertHidden'), 6000)

  if (pauseTime && pauseTime > 0) {
    currentTime = pauseTime
  }

  if (currentTime > 0) {

    userMinuteInput.setAttribute('disabled', true)
    userSecondInput.setAttribute('disabled', true)
    userMinuteInput.classList.add('smallInput');
    userSecondInput.classList.add('smallInput');
    userMinuteInput.classList.remove('bigInput');
    userSecondInput.classList.remove('bigInput');

    btnReset.classList.add('btnReset')
    start.classList.remove('btn-primary')
    start.classList.add('btn-warning')
    start.innerText = 'Pause'

    start.addEventListener('click', pauseApp)

    timeoutId = setTimeout(() => {
      music.play();
      start.innerText = 'Reset'
      start.classList.remove('btn-warning')
      start.classList.add('btn-danger')
      start.removeEventListener('click', timerStart)
      start.removeEventListener('click', pauseApp)
      start.addEventListener('click', resetApp)
      clearTimeout(timeoutId)
    }, currentTime)


    intervalId = setInterval(() => {
      currentTime -= 1000
      calcTime();
      localStorage.setItem('currentTime', currentTime)
      if (currentTime < 1000) {
        clearInterval(intervalId)
        semicolon.classList.add('spanHidden');
        minutes.innerText = "";
        if (!staticTime) {
          seconds.innerText = 'Timer is stopped'
        } else { seconds.innerText = '' }

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

  spanTimerBlock.style.opacity = "1";
}


function pauseApp() {
  // debugger
  pauseTime = currentTime;

  if (currentTime > 0) {
    calcTime();
    btnReset.classList.remove('btnReset')

    btnReset.addEventListener('click', resetApp)
    clearTimeout(timeoutId)
    clearInterval(intervalId)

    start.classList.remove('btn-primary')
    start.classList.add('btn-warning')

    start.innerText = 'Continue'
    // start.insertAdjacentElement('afterend', resetBtn)
    start.addEventListener('click', timerStart)
    localStorage.setItem('currentTime', currentTime)

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

  clearTimeout(timeoutId)
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

  localStorage.removeItem('currentTime')
  music.pause()
  start.innerText = 'Start'
  semicolon.classList.add('spanHidden');
  btnReset.classList.add('btnReset')
  start.classList.remove('btn-warning')
  start.classList.remove('btn-danger')
  start.classList.add('btn-primary')

  btnReset.removeEventListener('click', resetApp)
  start.removeEventListener('click', pauseApp)
  start.addEventListener('click', timerStart)

  return
}





