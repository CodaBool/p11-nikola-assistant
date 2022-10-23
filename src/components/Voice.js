import {useState, useEffect} from 'react'
import { Row } from 'react-bootstrap';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicLiveGif from '../assets/mic-live.gif'

export default function Voice({ state, testing, setCmd, hide }) {
  const [message, setMessage] = useState('')

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition. Please use Chrome</span>
  }

  useEffect(() => {
    if (!setCmd) return
    const recentMsg = transcript.split(' ').slice(-1)[0].toLowerCase()
    if (recentMsg.includes('left')) {
      setCmd('left')
    } else if (recentMsg.includes('right')) {
      setCmd('right')
    } else if (recentMsg.includes('up')) {
      setCmd('up')
    } else if (recentMsg.includes('down')) {
      setCmd('down')
    } else if (recentMsg.includes('stop')) {
      setCmd('stop')
    }
  }, [transcript])

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true })

    const intervalId = setInterval(() => {
      resetTranscript()
    }, 1000 * 60) // in milliseconds
    return () => clearInterval(intervalId)
  }, [])

  if (hide) {
    return null
  }


  return (
    <div>
      <Row>
        {listening 
          ? <img src={MicLiveGif} className="m-auto" style={{width: '110px', height: '80px'}} />
          : <p className="text-center">Mic Not listening</p>
        }
      </Row>
      {/* <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button> */}
      {transcript}
      <hr />
      {message}
      {listening && !transcript
        && <p className='mt-2'>try saying something into the mic</p>
      }
    </div>
  )
}
