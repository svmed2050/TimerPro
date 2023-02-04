function getInputSmall() {
  userMinuteInput.setAttribute('disabled', true)
  userSecondInput.setAttribute('disabled', true)
  userMinuteInput.classList.add('smallInput');
  userSecondInput.classList.add('smallInput');
  userMinuteInput.classList.remove('bigInput');
  userSecondInput.classList.remove('bigInput');
}

function getInputBig() {
  userMinuteInput.removeAttribute('disabled')
  userSecondInput.removeAttribute('disabled')
  userMinuteInput.classList.remove('smallInput');
  userSecondInput.classList.remove('smallInput');
  userMinuteInput.classList.add('bigInput');
  userSecondInput.classList.add('bigInput');
}

export { getInputSmall, getInputBig }