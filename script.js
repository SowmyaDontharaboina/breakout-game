const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColCount = 5;
let bricks = [];
//Ball properties
const ballProps = {
    x: canvas.width/2,
    y: canvas.height/2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
};

//Paddle properties
const paddleProps = {
    x: canvas.width/2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
};

//Brick properties
const brickProps = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};


function drawBricks() {
    bricks.forEach(col => {
        col.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill()
            ctx.closePath();
        })
    })
}
createBrick();
function createBrick() {
    for(let i = 0;i<brickRowCount;i++) {
        bricks[i] = [];
        for(let j=0;j<brickColCount;j++) {
            const x = i * (brickProps.w + brickProps.padding) + brickProps.offsetX;
            const y = j * (brickProps.h + brickProps.padding) + brickProps.offsetY;
            bricks[i][j] = { x, y, ...brickProps};
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballProps.x, ballProps.y, ballProps.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill()
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleProps.x, paddleProps.y, paddleProps.w, paddleProps.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill()
    ctx.closePath();
}
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width-100, 30);
}
//Move paddle on canvas
function movePaddle() {
    paddleProps.x += paddleProps.dx;

    //wall detection 
    if(paddleProps.x + paddleProps.w > canvas.width) {
        paddleProps.x = canvas.width - paddleProps.w;
    }

    if(paddleProps.x < 0) {
        paddleProps.x = 0;
    }
}

function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true;
        })
    })
}

function increaseScore() {
    score += 1;

    if(score % (brickRowCount * brickColCount) === 0) {
        showAllBricks();
    }
}

//Move Ball on canvas
function moveBall() {
    ballProps.x += ballProps.dx;
    ballProps.y += ballProps.dy;

    //Wall collision (right/left)
    if(ballProps.x + ballProps.size > canvas.width || ballProps.x - ballProps.size < 0) {
        ballProps.dx *= -1;
    }
    //Wall collision (top/bottom)
    if(ballProps.y + ballProps.size > canvas.height || ballProps.y - ballProps.size < 0) {
        ballProps.dy *= -1;
    }
    // console.log(ballProps.x,ballProps.y);
    // paddle collision

    if( ballProps.x - ballProps.size > paddleProps.x && 
        ballProps.x + ballProps.size < paddleProps.x + paddleProps.w && 
        ballProps.y + ballProps.size > paddleProps.y) {
        ballProps.dy = -ballProps.speed;
    }

    //Bricks collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if(brick.visible) {
                if(ballProps.x - ballProps.size > brick.x && //Left brick side check
                  ballProps.x + ballProps.size < brick.x + brick.w && // right brick side check
                 //check
                 ballProps.y + ballProps.size > brick.y && //top brick side check
                 ballProps.y - ballProps.size < brick.y + brick.h //bottom brick side check
                ) {
                    ballProps.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        })
    });

    //Hit bottom we loose
    if(ballProps.y + ballProps.size > canvas.height) {
        showAllBricks();
        score = 0;
    }

}
function draw() {
    //clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
};

//update canvas and animation
function update() {
    movePaddle()
    moveBall()
    //draw all
    draw();
    //animation frame
    requestAnimationFrame(update);
}

function keyDown(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        paddleProps.dx = paddleProps.speed;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        paddleProps.dx = -paddleProps.speed;
    }
}
function keyUp(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddleProps.dx = 0;
    }
}
update();



//key board event handler

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
rulesBtn.addEventListener('click', e => rules.classList.add('show'))
closeBtn.addEventListener('click', e => rules.classList.remove('show'))