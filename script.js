let canvas, canvasContext;
let ballX = 50, ballY = 50;
let ballSpeedX = 10, ballSpeedY = 4;

let player1Score = 0, player2Score = 0;
const WINNING_SCORE = 3;
let winScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

function calculateMousePos(e){
  const RECT = canvas.getBoundingClientRect();
  const root = document.documentElement;
  let mouseX = e.clientX - RECT.left - root.scrollLeft;
  let mouseY = e.clientY - RECT.top - root.scrollTop;
  return{
    x:mouseX,
    y:mouseY
  }
}

function handleMouseClick(e){
  if(winScreen){
    player1Score = 0;
    player2Score = 0;
    winScreen = false;
  }
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  const fps = 30;
  setInterval(function(){
    moveEverything();
    drawEverything();
  }, 1000/fps)

  canvas.addEventListener('mousedown', handleMouseClick)

  canvas.addEventListener('mousemove', function(e){
    let mousePos = calculateMousePos(e);
    paddle1Y = mousePos.y -(PADDLE_HEIGHT/2);
  })
}

function computerMovement(){
  let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2)
  if(paddle2YCenter < ballY - 15){
    paddle2Y += 6;
  }else if(paddle2YCenter > ballY + 15 ){
    paddle2Y -= 6;
  }
}

function moveEverything (){
  if(winScreen){
    return;
  }
  computerMovement()
  ballX += ballSpeedX;
	ballY += ballSpeedY;
  if(ballX < 0) {
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX
      let deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY*0.33;
    }else{
      player2Score ++;
      ballReset()
    }
	}
	if(ballX > canvas.width) {
    if(ballY > paddle2Y && ballY < paddle2Y +PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY*0.33;
    }
    else{
      player1Score ++;
      ballReset();
    }
	}
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet(){
  for(let i = 0; i < canvas.height; i += 40){
    colorRect(canvas.width/2-1,i,2,20,'white')
  }
}

function drawEverything(){
  colorRect(0,0,canvas.width,canvas.height, 'black');

  if(winScreen){
    canvasContext.fillStyle = 'white'
    if(player1Score >= WINNING_SCORE){
      canvasContext.fillText('Player wins!', 350, 200)
    }else if(player2Score >= WINNING_SCORE){
      canvasContext.fillText('Computer wins!', 350, 200)
    }
    canvasContext.fillText('Click to Play Again', 100,100)
    return;
  }

  colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white');
  colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, 100, 'white');
  colorCircle(ballX, ballY, 5, 'white')

  canvasContext.fillText(player1Score, 100, 100)
  canvasContext.fillText(player2Score, canvas.width-100, 100)
  drawNet()
}

function colorRect(leftX, topY, width, height, color){
  canvasContext.fillStyle = color;
	canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX,centerY,radius, color){
  canvasContext.fillStyle = color
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function ballReset(){
  if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
    winScreen = true;
  }
  ballSpeedX = -ballSpeedX
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}