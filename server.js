import 'dotenv/config'
import { Server } from "socket.io"
import mongoose from 'mongoose'
import Game from './Models/Game.js'

import allData from "./constants/data.json" assert { type: "json" }
// import simpleData from "./constants/simple.json" assert { type: "json" }

const port = process.env.PORT || 3000
const ROOM_CHAR_SIZE = 6
const io = new Server(port, {
  cors: { origin: "*" }
})
await mongoose.connect(process.env.MONGO_URI)

const players = new Map()
class Player {
  constructor(name, isLeader, cid, room, sid) {
    this.name = name
    this.isLeader = isLeader
    this.room = room
    this.cid = cid
    this.sid = sid
  }
  wpm = -1
  givenUp = false
  isReady = false
  isWinner = false
  percent = 0
  wins = 0
}

io.on('connection', async socket => {
  var gameTime = null
  // TODO: set room char size to a constant
  const id = socket.id
  let room = id.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, ROOM_CHAR_SIZE)

  socket.on('progress', async ({ percent, gid }) => {
    try {
      let game = await Game.findById(gid)

      if (!game.isStarted) return
      // const player = players.get(id)
      const player = game.players.find(player => player.sid === id)

      console.log('got from', player.name, 'progress to', percent)

      if (percent < 100) { // unfinished and verify that there was a change
        if (player.percent !== percent) {
          // console.log('progress change game state =', game)
          // console.log('progress for', player.name, game.players[index].percent, '->', percent)
          player.percent = percent
          game = await game.save() // too many calls to perform a save every progress
          io.to(gid).emit('updateGame', game)
        }
      } else {
        // calculate Words Per Minute
        player.wpm = calculateWPM(game.startTime, player, game.words)
        player.percent = 100

        // if no one is winner set winner
        let existsWinner = false
        for (const player of game.players) {
          if (player.isWinner) {
            existsWinner = true
          }
        }
        if (!existsWinner) {
          player.wins++
          player.isWinner = true
        }

        // find if all players have finished
        let allDone = true
        for (const player of game.players) {
          if (player.percent !== 100 && !player.givenUp) {
            allDone = false
          }
        }
        if (allDone) {
          console.log('everyone finished or gave up')
          resetPlayers(game)
          io.to(gid).emit('done', {winnerID: player.cid, game})
        }
        // save game
        game = await game.save()
        io.to(gid).emit('updateGame', game)
      }
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('give-up', async ({ gid }) => {
    try {
      let game = await Game.findById(gid)
      // console.log('INITIAL: game', game._id, 'playerID', playerID)
      let allDone = true
      for (const player of game.players) {
        if (player.sid === id) {
          console.log('found this player', player.name, 'setting givenUp to true')
          player.givenUp = true
        } else {
          console.log('checking status of', player.name, 'percent =', player.percent, ' & givenUp status =', player.givenUp)
          if (player.percent !== 100 && !player.givenUp) {
            console.log('since percent was not all the way and not given up, the game will continue')
            allDone = false
          }
        }
      }

      if (allDone) {
        console.log('last player gave up, Finishing game', gid)
        game.isOpen = true
        game.isStarted = false

        const winnerID = getWinner(game)

        // set winner
        if (winnerID) {
          for (const player of game.players) {
            if (player.cid === winnerID) {
              console.log('saving winner as', player.name)
              player.isWinner = true
            }
          }
        }

        console.log('sending done with', gid, 'and', winnerID)
        resetPlayers(game)
        io.to(gid).emit('done', {winnerID, game})
        game = await game.save()
        return
      } else {
        console.log('logic says that the game should NOT end')
      }
      io.to(gid).emit('updateGame', game)
      game = await game.save()
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('timer', async ({ gid }) => {
    // time in seconds
    let countDown = 5
    // find game
    let game = await Game.findById(gid)
    // find player who made request
    // let player = game.players.id(playerID)
    let player = players.get(id)
    // check if player has permission to start game

    let allReady = true
    // check if everyone is ready
    game.players.forEach(player => {
      if (!player.isReady) {
        allReady = false
      }
    })

    if (player.isLeader && allReady) {

      if (countDown == 5) { // move from lobby to game
        // reset player stats
        // console.log('reseting player stats, starting game in', countDown)
        for (const player of game.players) {
          player.wpm = -1
          player.percent = 0
          player.givenUp = false
          player.ready = false
          player.isWinner = false
          // prod data
          const excerpt = allData[Math.floor(Math.random() * allData.length)]
          // test data
          // const excerpt = simpleData[Math.floor(Math.random() * simpleData.length)]
          
          game.quote = excerpt.quote
          game.source = excerpt.source
          game.speed = excerpt.speed
          game.words = excerpt.quote.split(' ').length
        }
        game.isTypable = false
        game.isStarted = true
        game = await game.save()
        io.to(gid).emit('updateGame', game)
      }

      // clear if existing
      if (gameTime) {
        console.log('clearing past gameTime interval')
        clearInterval(gameTime)
      }
      
      // start time countdown
      let timerID = setInterval(async () => {
        // keep counting down until we hit 0
        if (countDown >= 0) {
          // emit countDown to all players within game
          io.to(gid).emit('timer', { countDown, msg: "Starting Game" })
          countDown--
        }
        // start time clock over, now time to start game
        else {
          io.to(gid).emit('start-race')
          // close game so no one else can join
          game.isOpen = false
          game.isTypable = true

          // save the game
          game = await game.save()
          // send updated game to all sockets within game
          io.to(gid).emit('updateGame', game)
          // start game clock
          startGameClock(gid)
          clearInterval(timerID)
        }
      }, 1000)
    }
  })

  socket.on('join-game', async ({ gid, name, cid }) => {
    try {
      // get game
      let game = await Game.findById(gid)
      if (!game) {
        throw `No game found by ID ${gid}`
      }
      // check if game is allowing users to join
      if (game.isOpen) {

        // check if player is already in game
        const playerObj = game.players.find(player => player.name === name)
        if (playerObj) {
          throw 'A player with that name already exists. Please change your name and try again or create a new game.'
        }

        // make players socket join the game room
        socket.join(gid)
        console.log(name, 'is leaving previous room of', room, 'to join', gid)
        socket.leave(room)
        room = gid
        // create our player
        const player = new Player(name, false, cid, room, id)

        // add player
        players.set(id, player)
        // add player to the game
        game.players.push(player)
        // save the game
        game = await game.save()
        // send updated game to all sockets within game

        console.log('emitting to updateGame new player', name, gid)

        io.to(gid).emit('updateGame', game)
      } else {
        // deny request
        // console.log('game closed id =', gameID)
        throw 'Game Closed'
      }
    } catch (err) {
      console.log(err)
      if (typeof err === 'string') { // thrown error, 400
        socket.emit('error', err)
      } else { // unknown server error 500
        socket.emit('error', err.message || err)
      }
    }
  })

  socket.on('change-ready', async ({ gid, cid, isReady }) => {
    try {
      let game = await Game.findById(gid)
      for (const player of game.players) {
        if (player.cid === cid) {
          if (player.isReady !== isReady) {
            player.isReady = isReady
            game = await game.save()
            // console.log('updated Game Ready state', player.name, 'to', isReady)
            io.to(gid).emit('updateGame', game)
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('change-open', async ({ gid, isOpen }) => {
    try {
      let game = await Game.findById(gid)
      if (game.isOpen !== isOpen) {
        game.isOpen = isOpen
        game = await game.save()
        // console.log('updated Game Open state', gameID, 'to', isOpen)
        io.to(gid).emit('updateGame', game) 
      }
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('send-message', body => {
    io.to(room).emit('get-message', body)
  })

  socket.on('create-game', async ({ name, cid }) => {
    try {
      // create game
      let game = new Game()
      // production data
      const excerpt = allData[Math.floor(Math.random() * allData.length)]
      // test data
      // const excerpt = simpleData[Math.floor(Math.random() * simpleData.length)]
      
      game.quote = excerpt.quote
      game.source = excerpt.source
      game.speed = excerpt.speed
      game.words = excerpt.quote.split(' ').length
      game._id = room
      
      // create player
      const player = new Player(name, true, cid, room, id)

      // add player
      players.set(id, player)
      game.players = [player]

      // save the game
      game = await game.save()
      // make players socket join the game room
      socket.join(room)
      // send updated game to all sockets within game
      console.log("sending update to room", room)
      io.to(room).emit('updateGame', game)
    } catch (err) {
      console.log(err)
    }
  })

  async function startGameClock(gameID) {
    // get the game
    let game = await Game.findById(gameID)
    // get time stamp of when the game started
    game.startTime = new Date().getTime()
    // save the game
    game = await game.save()
    // time is in seconds
    let time = 120
    // Start the Game Clock
    gameTime = setInterval(() => {
      // keep countdown going
      if (time >= 0) {
        const formatTime = calculateTime(time)
        console.log('time left', formatTime)
        io.to(gameID).emit('timer', { countDown: formatTime, msg: "Time Remaining" })
        time--
      }
      // game clock has run out, game is over
      else {
        (async () => {
          // find the game
          let game = await Game.findById(gameID)
          // calculate all players WPM who haven't finished typing out sentence
          let winnerID = null
          for (const player of game.players) {
            if (player.isWinner) {
              winnerID = player.cid
            }
            if (player.wpm === -1) {
              player.wpm = calculateWPM(game.startTime, player, game.words)
            }
          }
          winnerID = getWinner(game)
          // save the game
          game = await game.save()
          // send updated game to all sockets within game
          io.to(gameID).emit('updateGame', game)
          socket.emit('done')
          clearInterval(gameTime)
        })()
      }
    }, 1000)
  }

  async function resetPlayers(game) {
    game.isOpen = true
    game.isTypable = false
    game.isStarted = false
    for (const p of game.players) {
      p.percent = 0
      p.givenUp = false
      p.isReady = false
    }
    clearInterval(gameTime)
  }
})

function getWinner(game) {
  let highestPercent = 0
  let winnerID = null
  // find declared winner
  for (const player of game.players) {
    if (player.isWinner) {
      console.log('found an existing winner of', player.name)
      winnerID = player.cid
    }
    if (player.percent > highestPercent) {
      console.log('loop set of highestPercent', player.percent)
      highestPercent = player.percent
    }
  }
  console.log('finish player loops with highest percent', highestPercent, 'and declared winner', winnerID)
  // find closest winner if none were declared
  if (!winnerID) {
    for (const player of game.players) {
      if (player.percent >= highestPercent) {
        console.log('highest percent was by', player.name, 'with', player.percent)
        winnerID = player.cid
      }
    }
  }
  return winnerID
}

function calculateTime(time) {
  let minutes = Math.floor(time / 60)
  let seconds = time % 60
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
}

function calculateWPM(startTime, player, words, finished) {
  let numOfWords = 0
  if (finished) {
    numOfWords = words
  } else {
    numOfWords = player.percent / 100 * words
  }
  // use current time as end time
  const timeInSeconds = (new Date().getTime() - startTime) / 1000
  const timeInMinutes = timeInSeconds / 60
  const wpm = Math.floor(numOfWords/ timeInMinutes)
  return wpm
}