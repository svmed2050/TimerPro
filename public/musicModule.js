import * as sound from './music';

const objSound = {
  0: sound.SiaUnstoppable,
  1: sound.forest,
  2: sound.mountain,
  3: sound.summer,
}

export default function musicModule(music) {
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