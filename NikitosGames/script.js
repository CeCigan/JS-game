let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let level1 = [
    [],
    [],
    [],
    [],
    [],
    [],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R',],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R',],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G',],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G',],
    ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y',],
    ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y',],
];

const colorMap = {
    'R': "red", 
    "O": "orange", 
    "G": "green", 
    "Y": "yellow", 
};

const brickGap = 3;
const brickWidth = 25;
const brickHeight = 12;
const wallSize = 12;

const paddle = {
    x: canvas.width / 2 - brickWidth / 2,
    y: 440, 
    width: brickWidth,
    height: brickHeight,
    dx: 0
};

const ball = {
    x: 130, 
    y: 260,
    width: 5,
    height: 5,
    speed: 2, 
    dx: 0, 
    dy: 0
}

const bricks = [];

for(let row = 0; row <level1.length; row++){
    for(let col = 0; col <level1[row].length; col++){
        const colorCode = level1[row][col];
        
        bricks.push({
            x: wallSize + (brickWidth + brickGap) * col, 
            y: wallSize + (brickWidth + brickGap) * row, 
            color: colorMap[colorCode],
            width: brickWidth, 
            height: brickHeight
        });
    }
}

function collides(obj1, obj2){
    return obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y;
}

document.addEventListener('keydown', function(e){
    if(e.which === 37){
        paddle.dx = -3;
    }
    else if(e.which === 39){
        paddle.dx  =3;
    }

    if(ball.dx ===0 && ball.dy ===0 && e.which ===32){
        ball.dx = ball.speed;
        ball.dy = ball.speed;
    }
});

document.addEventListener('keyup', function(e){
    if(e.which === 37 || e.which === 39){
        paddle.dx = 0;
    }
});

function loop(){
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0 , canvas.width, canvas.height);

    paddle.x =+ paddle.dx;

    //Проверка не уезда за стенку
    if(paddle.x < wallSize){
        paddle.x = wallSize;
    }
    else if(paddle.x + brickWidth > canvas.width - wallSize){
        paddle.x = canvas.width - wallSize + brickWidth;
    }

    ball.x = ball.dx;
    ball.y = ball.dy;
}