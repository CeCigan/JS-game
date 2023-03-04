let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
let record = 0;

let level1 = [
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

const brickGap = 2;
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


//Пересечение объектов
function collides(obj1, obj2){
    return obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y;
}

document.addEventListener('keydown', function(e){
    //Движение влева
    if(e.which === 37){
        paddle.dx = -3;
    }
    //Движение вправо
    else if(e.which === 39){
        paddle.dx  = 3;
    }

    //Нажатие на пробел
    //Если шарик не запущен - запускаем его из стартовой точки
    if(ball.dx ===0 && ball.dy ===0 && e.which ===32){
        ball.dx = ball.speed;
        ball.dy = ball.speed;
    }
});

//Если клавиши движения отпущены - останавливеам платформу
document.addEventListener('keyup', function(e){
    if(e.which === 37 || e.which === 39){
        paddle.dx = 0;
    }
});

function loop(){
    let divRecords = document.getElementById('record');
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0 , canvas.width, canvas.height);

    paddle.x += paddle.dx;

    //Проверка ухода платформы за стенку
    if(paddle.x < wallSize){
        paddle.x = wallSize;
    }
    else if(paddle.x + brickWidth > canvas.width - wallSize){
        paddle.x = canvas.width - wallSize - brickWidth;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    //Проверка за невыход за левую
    if(ball.x < wallSize){
        ball.x = wallSize;
        ball.dx *=-1;
    }
    // и правую границу
    else if(ball.x + ball.width > canvas.width - wallSize){
        ball.x = canvas.width - wallSize - ball.width;
        ball.dx *= -1;
    }
    //Вверхня граница
    if(ball.y < wallSize){
        ball.y = wallSize;
        ball.dy *= -1;
    }

    //Проигрыш
    if(ball.y > canvas.height){
        ball.x = 130;
        ball.y = 260;
        ball.dx = 0;
        ball.dy = 0;
        ball.speed = 2;
    }

    //Косание платформы
    if(collides(ball, paddle)){
        ball.dy *= -1;

        //Сдвигаем шар выше платформы, чтобы на слудущем кадре не засчиталось столкновение
        ball.y = paddle.y - ball.height;
    }
    //Проверяем, коснулся ли шар кирпича
    for(let i = 0; i< bricks.length; i++){
        const brick = bricks[i];

        if(collides(ball, brick)){
            record++;
            bricks.splice(i, 1); 
            paddle.width -= 1;
            //Уменьшение платформы при увеличении очков
            if(paddle.width == 12){
                paddle.width +=1;
            }      
            
            ball.speed+=1;
            console.log('Ball-speed: ' + ball.speed);

            //Если шарик консулся кирпича сверху / снизу
            if(ball.y + ball.height - ball.speed <= brick.y || 
                ball.y >= brick.y + brick.height - ball.speed){
              ball.dy *= -1;
            }
            //Иначе меняем направление движенеи шарика по оси Х
            else {
                ball.dx *= -1;
            }
            break;
        }
    }
        

    //Рисуем арену
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(0, 0, canvas.width, wallSize);
    ctx.fillRect(0, 0, wallSize, canvas.height);
    ctx.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height)

    //Отрисовка шарика в движении
    if(ball.dx || ball.dy){
        ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
    }

    //Рисуем кирпичи
    bricks.forEach(function(brick){
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    });

    //Отрисовываем платформу
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    divRecords.innerHTML = record;
}
requestAnimationFrame(loop);