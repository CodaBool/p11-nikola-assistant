import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
// import * as THREE from 'three'
import backgroundImg from './assets/maps.png'
import Voice from './components/Voice'
import Modal from './components/gameModal'
import crashAudio from './assets/audio/car-crash.wav'
import countAudio from './assets/audio/three-second-countdown.wav'
import successAudio from './assets/audio/applause01.wav'
import useAudio from './components/AudioPlayer'

function Box({x, y, peds, setState, position, gameState, setShowModal, playCrashAudio, playSuccessAudio}) {
  const mesh = useRef()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => {
    if (gameState !== 'play') return

    // check endstate
    if (peds) {
      goalCheck(peds, mesh.current.position, setState, setShowModal, playCrashAudio, playSuccessAudio)
    }

    // movement
    if (x === 'right') {
      if (mesh.current.position.x < 3.5) {
        mesh.current.position.x += 0.01
      }
    } else if (x === 'left') {
      if (mesh.current.position.x > -3.5) {
        mesh.current.position.x -= 0.01
      }
    } else if (y === 'up') {
      if (mesh.current.position.y < 3.5) {
        mesh.current.position.y += 0.01
      }
    } else if (y === 'down') {
      if (mesh.current.position.y > -3.5) {
        mesh.current.position.y -= 0.01
      }
    }
    // var rect = document.query.s.getBoundingClientRect();
    // console.log(mesh.current.position)
  })
  return (
    <mesh
      ref={mesh}
      scale={0.1}
      position={position}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Circle({goal, position}) {
  const mesh = useRef()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // console.log(position)
  useFrame((state, delta) => {
    mesh.current.rotation.z += 0.01
  })
  return (
    <mesh
      position={position}
      ref={mesh}
      scale={0.15}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <circleGeometry args={[.8, 8, 0]} />
      <meshStandardMaterial color={goal ? 'green' : 'red'} />
    </mesh>
  )
}

function goalCheck(peds, player, setState, setShowModal, playCrashAudio, playSuccessAudio) {
  for (const i in peds) {
    const xPos = player.x - peds[i].x 
    const yPos = player.y - peds[i].y 
    if (Math.abs(xPos) < .1 && Math.abs(yPos) < .1) {
      if (peds[i].goal) {
        setState('won')
        setShowModal(true)
        playSuccessAudio()
        return true
      } else {
        setState('lost')
        setShowModal(true)
        playCrashAudio()
        return true
      }

    }
  }
}

export default function Game() {
  const [state, setState] = useState('start')
  const [cmd, setCmd] = useState()
  const [showModal, setShowModal] = useState(true)
  const [playerPosition, setPlayerPosition] = useState([0, -3, 0])
  const [peds, setPeds] = useState([])
  const [y, setY] = useState('up')
  const [x, setX] = useState()
  const [playing, playCrashAudio] = useAudio(crashAudio)
  const [playing2, playSuccessAudio] = useAudio(successAudio)
  const [playing3, playCountdownAudio] = useAudio(countAudio)

  function reset() {
    // create peds
    const arr = Array.from(Array(20).keys())
    for (let i = 0; i < 20; i++) {
      const isNeg = Math.round( Math.random()*10 )
      const isNeg2 = Math.round( Math.random()*10 )
      
      let x = Math.random()*3
      if (isNeg > 5) {
        x *= -1
      }
      let y = Math.random()*3
      if (isNeg2 > 5) {
        y *= -1
      }

      arr[i] = {x, y, goal: i === 0 ? true : false}
      setPeds(arr)
    }

    // set player
  }

  useEffect(() => {
    reset()
    // capture input
    // if (typeof window !== 'undefined') {
    //   const handleKeyDown = (e) => {
    //     // console.log('key', e.key)
    //     if (e.key === 'ArrowUp') {
    //       setY('up')
    //       setX()
    //     } else if (e.key === 'ArrowDown') {
    //       setY('down')
    //       setX()
    //     } else if (e.key === 'ArrowLeft') {
    //       setY()
    //       setX('left')
    //     } else if (e.key === 'ArrowRight') {
    //       setY()
    //       setX('right')
    //     } else if (e.key === ' ') {
    //       setY()
    //       setX()
    //     }
    //   }
    //   document.addEventListener('keydown', handleKeyDown)
    //   return () => {
    //     document.removeEventListener('keydown', handleKeyDown)
    //   }
    // }
  }, [])

  useEffect(() => {
    if (cmd === 'up') {
      setY('up')
      setX()
    } else if (cmd === 'down') {
      setY('down')
      setX()
    } else if (cmd === 'left') {
      setY()
      setX('left')
    } else if (cmd === 'right') {
      setY()
      setX('right')
    } else if (cmd === 'stop') {
      setY()
      setX()
    }
  }, [cmd])

  return (
    <div
      className="menuPage"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        height: "90vh",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Box
          position={playerPosition} x={x} y={y} 
          peds={peds} 
          setState={setState} 
          setShowModal={setShowModal}
          gameState={state}
          playCrashAudio={playCrashAudio}
          playSuccessAudio={playSuccessAudio}
        />
        {peds && peds.map((ped, index) => (
           <Circle 
            key={index} 
            goal={ped.goal} 
            position={[ped.x, ped.y, 0]} 
          />
        ))}
      </Canvas>
      <Modal state={state} playCountdownAudio={playCountdownAudio} show={showModal} setShow={setShowModal} setState={setState} setPlayerPosition={setPlayerPosition} />
      {/* {cmd === 'up' && <h1 className="text-center">⬆️</h1>}
      {cmd === 'down' && <h1 className="text-center">⬇️</h1>}
      {cmd === 'left' && <h1 className="text-center">⬅️</h1>}
      {cmd === 'right' && <h1 className="text-center">➡️</h1>}
      {cmd === 'stop' && <h1 className="text-center">🛑</h1>} */}
      {/* {cmd && <h1 className="text-center">{cmd}</h1>} */}
      {state === 'play' && <Voice state={state} setCmd={setCmd} hide />}
    </div>
  )
}

