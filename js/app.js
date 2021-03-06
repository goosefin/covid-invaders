//VARIABLES
const player1 = document.getElementById('player-1-icon');
const player2 = document.getElementById('player-2-icon');
const canvas = document.getElementById('canvas');
const popUp = document.querySelector('#pop-up')
const titleCard = document.querySelector('#title-card')
const playerOneName = document.querySelector('#p1')
const playerTwoName= document.querySelector('#p2')
const ctx = canvas.getContext('2d');
const shotsArray = [];
const cellsArray = []
const covidCells = document.querySelector('#covid-cells')
let timer = document.querySelector('#timer');
let playerOneCount = document.querySelector('#player-one')
let playerTwoCount = document.querySelector('#player-two')
let playerOneShot = false
let playerTwoShot = false
let timeCounter = 20

//GAME OBJECT WITH PLAYERS AND METHODS
const game = {
    firstPlayer: {
        w:100,
        h:100,
        x:0,
        y:550,
        speed: 5,
        dx: 0,
        dy: 0,
        score: 0
    },
    secondPlayer: {
        w:100,
        h:100,
        x:1000,
        y:550,
        speed: 5,
        dx: 0,
        dy: 0,
        score:0
    },
    checkWinner(){
        if(this.firstPlayer.score > this.secondPlayer.score){
            const winnerPopUp = document.createElement('h2')
            document.body.appendChild(winnerPopUp)
            winnerPopUp.innerText=`${playerOneName.value} wins!!`
        }else if(this.secondPlayer.score > this.firstPlayer.score){
            const winnerPopUp2 = document.createElement('h2')
            document.body.appendChild(winnerPopUp2)
            winnerPopUp2.innerText=`${playerTwoName.value} wins`
        }else if(this.firstPlayer.score == this.secondPlayer.score){
            const tiePopUp = document.createElement('h2')
            document.body.appendChild(tiePopUp)
            tiePopUp.innerText = 'Players Tied!!'
        }
    },
    runTimer(){
        if(timeCounter > 0){
            timeCounter -= 1
            timer.innerText = `Time: ${timeCounter}`
        }
    },
    startGame(){
        const cellSpawn = setInterval(()=>{
            cellsArray.push(new Cell({
                position:{
                    x:Math.floor(Math.random() * canvas.width),
                    y:0
                },
                velocity:{
                    x:0,
                    y:3
                }
            }))
        },1000);
        let timerCount = setInterval(() => {
            this.runTimer()
            if(timeCounter == 0){
                this.checkWinner()
                clearInterval(timerCount)
                clearInterval(cellSpawn)
                timer.innerText = 'Game Over'
                setTimeout(() => {
                    alert('Play again?')
                    location.reload()
                },5000)
            }
        },1000);
    },
    drawPlayer(){
        ctx.drawImage(player1, this.firstPlayer.x, this.firstPlayer.y, this.firstPlayer.w, this.firstPlayer.h)
        ctx.drawImage(player2, this.secondPlayer.x, this.secondPlayer.y, this.secondPlayer.w, this.secondPlayer.h)
    },
    clear(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
    newPos(){
        this.firstPlayer.x += this.firstPlayer.dx;
        this.firstPlayer.y += this.firstPlayer.dy;
        this.secondPlayer.x += this.secondPlayer.dx;
        this.secondPlayer.y += this.secondPlayer.dy;
        this.detectWalls()
    },
    detectWalls(){
        //LEFT WALL DETECTION
        if(this.firstPlayer.x < 0){
            this.firstPlayer.x = 0
        }
        if(this.secondPlayer.x < 0){
            this.secondPlayer.x = 0
        }
        //RIGHT WALL DETECTION
        if(this.firstPlayer.x + this.firstPlayer.w > canvas.width){
            this.firstPlayer.x = canvas.width - this.firstPlayer.w
            
        }
        if(this.secondPlayer.x + this.secondPlayer.w > canvas.width){
            this.secondPlayer.x = canvas.width - this.secondPlayer.w
        }
    }

}

//CELL CLASS CONSTRUCTOR
class Cell {
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 8
    }
    drawCell(){
        ctx.fillStyle = '#40D61A'
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    updateCell(){
        this.drawCell()
        this.position.y += this.velocity.y
    }
}

//BULLET CLASS CONSTRUCTOR
class Bullet {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }
    drawBullet(){
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.drawBullet()
        this.position.y += this.velocity.y
    }
}

//ANIMATION LOOPS FOR BULLET AND CELLS
//COLLISION DETECTION
const animate = () =>{
    shotsArray.forEach(bullet => {
        bullet.update()
    })
    cellsArray.forEach((cell, index) =>{
        if(cell.position.y >= 660){
            cellsArray.splice(index,1)
        }else{
            cell.updateCell()
        }
    })
    shotsArray.forEach((bullet, i) =>{
        cellsArray.forEach((cell,j) => {
            if(bullet.position.x <= cell.position.x + 15 && bullet.position.x >= cell.position.x - 15 && bullet.position.y <= cell.position.y + 15 && bullet.position.y >= cell.position.y - 15)  {
                if(playerOneShot){
                    cellsArray.splice(j, 1)
                    shotsArray.splice(i, 1)
                    game.firstPlayer.score += 1
                    playerOneCount.innerText = `${playerOneName.value}: ${game.firstPlayer.score}`
                }else if(playerTwoShot){
                    cellsArray.splice(j, 1)
                    shotsArray.splice(i, 1)
                    game.secondPlayer.score += 1
                    playerTwoCount.innerText = `${playerTwoName.value}: ${game.secondPlayer.score}`
                }
            }
        })
    })
}

//UPDATE LOOP TO ANIMATE PLAYER AND CALL BACK TO ANIMATE BULLETS AND CELLS
const update = () => {
    game.clear()
    game.drawPlayer()
    game.newPos()
    animate()
    requestAnimationFrame(update)
}

//MOVE RIGHT
const moveRight = (player) => {
    player.dx = player.speed
}

//MOVE LEFT
const moveLeft = (player) => {
    player.dx = -player.speed
}

//FUNCTION FOR PLAYER MOVEMENTS
const keyDown = (e) => {
    if(e.code === 'KeyD'){
        moveRight(game.firstPlayer)
    }else if(e.code === 'KeyA'){
        moveLeft(game.firstPlayer)
    }else if(e.code === 'ArrowRight'){
        moveRight(game.secondPlayer)
    }else if(e.code === 'ArrowLeft'){
        moveLeft(game.secondPlayer)
    }
}

//CLEARING FOR PLAYER MOVEMENT 
const keyUp = (e) => {
    if(e.code === 'KeyD' || e.code === 'KeyA'){
        game.firstPlayer.dx = 0;
        game.firstPlayer.dy = 0;
    }else if(e.code === 'ArrowLeft' || e.code === 'ArrowRight'){
        game.secondPlayer.dx = 0
        game.secondPlayer.dy = 0
    }
}

//PLAYER ONE SHOOTING FUNCTION
const player1Shoot = (e) => {
    if(e.code === 'ShiftLeft'){
        playerOneShot = true
        shotsArray.push(new Bullet({
            position:{
                x: game.firstPlayer.x + game.firstPlayer.w / 2,
                y: game.firstPlayer.y
            },
            velocity:{
                x:0,
                y: -5
            }
        }))
    }
}

//PLAYER TWO SHOOTING FUNCTION
const player2Shoot = (e) => {
    if(e.code === 'ShiftRight'){
        playerTwoShot = true
        shotsArray.push(new Bullet({
            position:{
                x: game.secondPlayer.x + game.secondPlayer.w / 2,
                y: game.secondPlayer.y
            },
            velocity:{
                x:0,
                y:-5
            }
        }))
    }
}

const removeTitleCard = () => {
    titleCard.style.display = 'none'
}

const removePopUp = () =>{
    popUp.style.display = 'none'
}

const playerNames = () => {
    playerOneCount.innerText = `${playerOneName.value}:`
    playerTwoCount.innerText = `${playerTwoName.value}:`
}

//EVENT HANDLER LISTENING
update()
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)
document.addEventListener('keydown',player1Shoot)
document.addEventListener('keydown',player2Shoot)
document.getElementById('play-button').addEventListener('click', () =>{
    playerNames()
    removePopUp()
    game.startGame()
})
document.getElementById('enter-button').addEventListener('click',removeTitleCard);