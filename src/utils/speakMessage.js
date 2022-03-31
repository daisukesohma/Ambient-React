import { SoundTypeEnum } from '../enums'

function speakMessage({ message, sound }) {
  // Play a notification beep
  const audio = sound ? new Audio(sound) : new Audio(SoundTypeEnum.DING)
  const promise = audio.play()

  if (message) {
    const speech = new SpeechSynthesisUtterance(message)
    if (promise !== undefined) {
      promise.catch(console.error).then(() => {
        setTimeout(() => {
          window.speechSynthesis.speak(speech)
        }, 1000)
      })
    }
  }
}

export default speakMessage
