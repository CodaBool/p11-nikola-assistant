import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Voice from "./Voice";
import { useState } from 'react'
import lostImg from '../assets/nikola-manager.jpg'
import wonImg from '../assets/nikola-won.jpg'

export default function CustomModal({ show, setShow, state, setState, setPlayerPosition, playCountdownAudio}) {
  const [counter, setCounter] = useState()

  function startGame() {
    playCountdownAudio()
    setCounter(3)
    setTimeout(() => {
      setCounter(2)
    }, "1000")
    setTimeout(() => {
      setCounter(1)
    }, "2000")
    setTimeout(() => {
      setCounter(0)
      setShow(false)
    }, "3000")
    setTimeout(() => {
      setState('play')
    }, "4000")
  }

  function resetGame() {
    window.location.reload(false);
    setState('start')
    // setShow(false)
    // TODO: find a way to reset without a full page reset
    // setPlayerPosition([0, -3, 0])
  }

  return (
    <Modal show={show} onHide={startGame}>
      <Modal.Header>
        {/* {counter && } */}
        {state === 'start' && !counter && <Modal.Title>How to play the game</Modal.Title>}
        {state === 'won' && <Modal.Title>You have arrived at your destination! 💖</Modal.Title>}
        {state === 'lost' && <Modal.Title><h1 className="display-4">You crashed!</h1></Modal.Title>}
      </Modal.Header>
      {state === 'start' &&
        <Modal.Body>
          {counter
            ? <h1 className="display-4 text-center">{counter}</h1>
            : <>
                <b>Rules of the game:</b>
                <br></br>
                <br></br>
                <ul>
                  <li>You have 1 minute to finish the game</li>
                  <li>You have 5 commands</li>
                </ul>

                <b>Commands:</b>
                <br></br>
                <br></br>
                <ul>
                  <li>"Up"</li>
                  <li>"Right"</li>
                  <li>"Down"</li>
                  <li>"Left"</li>
                  <li>"Stop"</li>
                </ul>
                <Voice testing />
              </>
          }
        </Modal.Body>
      }
      {state === 'won' &&
        <Modal.Body>
          <img src={wonImg} className="rounded w-100" />
        </Modal.Body>
      }
      {state === 'lost' &&
        <Modal.Body>
          <h4>Mr. Nikola will be here hearing about this</h4>
          <img src={lostImg} className="rounded w-100 mb-3" />
        </Modal.Body>
      }
      {!counter &&
        <Modal.Footer>
          {state === 'start' && <Button onClick={startGame} className="w-100" variant="success"> Start Game</Button>}
          {state === 'lost' && <Button onClick={resetGame} className="w-100" variant="danger">Play Again?</Button>}
          {state === 'won' && <Button onClick={resetGame} className="w-100" variant="primary"> Play Again</Button>}
        </Modal.Footer>
      }
    </Modal>
  );
}
