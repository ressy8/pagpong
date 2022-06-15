import Ball from "./ball.js"
import Paddle, { setSpeed, SPEED } from "./Paddle.js"

const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")
const easybtn = document.getElementById('easybtn')
const hardbtn = document.getElementById('hardbtn')
const diffDisplay = document.getElementById('diff-display')

const EASY_SPEED = 0.01
const HARD_SPEED = 0.05

easybtn.addEventListener('click', () => {
  setSpeed(EASY_SPEED)
  updateDiffDisplay()
})
hardbtn.addEventListener('click', () => {
  setSpeed(HARD_SPEED)
  updateDiffDisplay()
})

function updateDiffDisplay() {
  if (SPEED == EASY_SPEED) {
    diffDisplay.innerText = 'EASY'
  } else if (SPEED == HARD_SPEED) {
    diffDisplay.innerText = 'HARD' 
  } else {
    diffDisplay.innerText = 'UNKNOWN' 
  }
}

let lastTime
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
    computerPaddle.update(delta, ball.y)
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    )

    document.documentElement.style.setProperty("--hue", hue + delta * 0.01)

    if (isLose()) handleLose()
  }

  lastTime = time
  window.requestAnimationFrame(update)
}

function isLose() {
  const rect = ball.rect()
  return rect.right >= window.innerWidth || rect.left <= 0
}

function handleLose() {
  const rect = ball.rect()
  if (rect.right >= window.innerWidth) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1
  }
  ball.reset()
  computerPaddle.reset()
}

document.addEventListener("mousemove", e => {
  playerPaddle.position = (e.y / window.innerHeight) * 100
})

window.requestAnimationFrame(update)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ball.pausedVelo != null ? ball.pause() : ball.resume()
  }
})