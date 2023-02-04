
export default function inputCorrection() {

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