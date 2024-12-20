document.addEventListener("DOMContentLoaded", function () {
    const gameArena = document.getElementById("game-arena");
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStart = false;
    let food = { x: 300, y: 200 };
    let snake = [{ x: 120, y: 200 }, { x: 140, y: 200 }, { x: 160, y: 200 }];

    let dx = cellSize;
    let dy = 0;
    let intervalId;
    let gameSpeed = 200;

    function moveFood(){
        let newX,newY;
        do {
            newX=Math.floor(Math.random()*30)*cellSize;
            newY=Math.floor(Math.random()*30)*cellSize;
        } while (snake.some(snakeCell =>snakeCell.x===newX && snakeCell.y===newY));
        food = {x:newX, y:newY};
    }

    function updateSnake(){
        const newHead={x:snake[0].x+dx,y:snake[0].y+dy};
        snake.unshift(newHead);
        if(newHead.x==food.x && newHead.y==food.y){
            score+=10;
            moveFood();
            if(gameSpeed>50){
                clearInterval(intervalId);
                gameSpeed-=10;
                gameLoop();
            }
        }else{
            snake.pop();//remove tail
        }
    }

    function changeDirection(e){
        console.log("key pressed", e);
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        if(e.key === 'ArrowUp' && !isGoingDown ) {
            dx = 0;
            dy = -cellSize;
        } else if(e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if(e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if(e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }


    function drawFoodAndSnake() {
        gameArena.innerHTML = "";//clear the game arena

        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        })

        const foodElement = drawDiv(food.x, food.y, 'food')
        gameArena.appendChild(foodElement);

    }

    function isGameOver(){

       // snake collision checks
       for(let i = 1; i < snake.length; i++) {
        if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }

    // wall collision checks
    const hitLeftWall = snake[0].x < 0; // snake[0] -> head
    const hitRightWall = snake[0].x > arenaSize - cellSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > arenaSize - cellSize;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameLoop(){
        intervalId = setInterval(() => {
            
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard();
        }, gameSpeed);
    }

    function runGame() {
        if (!gameStart) {
            gameStart = true;
            document.addEventListener('keydown',changeDirection);
            gameLoop();
        }
        //loop();
    }

    function updateScoreBoard(){
        const scoreBoard=document.getElementById("score-board");
        scoreBoard.textContent=`Score: ${score}`;
    }

    function initiateGame() {
        const playButton = document.getElementById("start-btn");
        playButton.addEventListener("click", function startGame() {
            document.getElementById("start-btn").style.display = 'none';
            runGame();
        })
    };
    initiateGame();
})