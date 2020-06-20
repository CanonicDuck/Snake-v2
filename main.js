function $(id){
    return document.getElementById(id);
}

function init() {
    console.log("initialised");
    const canvas = document.getElementById("snake");
    const c = canvas.getContext("2d");

    let kw = $('w').value;  /** Number of cells (horizontal)     **/
    let kh = $('h').value;  /** Number of cells (vertical)       **/
    const box = 30; /** The length of square cell's side **/

    let speed = 8;


    let cellColor1 = $('c1').value;
    let cellColor2 = $('c2').value;
    const foodColor  = "rgb(244,0,24)";
    let headColor  = $('c3').value;
    let tailColor  = $('c4').value;

    let points = 0;
    let snake = spawnSnake();
    let food  = spawnFood();
    update();
    addEventListener("keydown", defineDirection);

    const wallThrough = 1;


    $("c1").addEventListener("change", function () {
        cellColor1 = $('c1').value;
    });
    $("c2").addEventListener("change", function () {
        cellColor2 = $('c2').value;
    });
    $("c3").addEventListener("change", function () {
        snake[0].col = $('c3').value;
    });
    $("c4").addEventListener("change", function () {
        tailColor = $('c4').value;
    });
    $("w").addEventListener("change", function () {
        kw = $('w').value;
        canvas.width = kw*box;
    });
    $("h").addEventListener("change", function () {
        kh = $('h').value;
        canvas.height = kh*box;
    });

    function checkCollisions(){
        if (snake[0].x === food.x && snake[0].y === food.y) {
            food = spawnFood();
            addNode();
            ++points;
            $("res").textContent = points.toString();
        }
        for (let i = 4; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                gameover();
            }
        }
    }


    createjs.Ticker.framerate = speed;
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.on("tick", move, console.log(points));

    function checkBorders(permission, i){
        if (permission === 1) {
            if (snake[i].x === -box) snake[i].x = (kw-1)*box;
            if (snake[i].y === -box) snake[i].y = (kh-1)*box;
            if (snake[i].x === kw*box) snake[i].x = -box;
            if (snake[i].y === kh*box) snake[i].y = -box;
        }
        else if (permission === 0) {
            if (snake[i].x < 0 || snake[i].y < 0 || snake[i].x >= kw*box || snake[i].y >= kh*box)
                gameover();
        }
    }

    function move(){
        let k = snake.length;
        for (let i = k-1; i >=0; --i) {
            snake[i].x += box*snake[i].vx;
            snake[i].y += box*snake[i].vy;

            checkBorders(wallThrough, i);

            if (k !== i+1) {
                snake[i + 1].vx = snake[i].vx;
                snake[i + 1].vy = snake[i].vy;
            }
            drawSnake();
            checkCollisions();
        }
    }

    function defineDirection(e) {
        switch (e.key) {
            case "ArrowLeft":
                if (snake[0].vx !== 1) {
                    snake[0].vx = -1;
                    snake[0].vy = 0;
                }
                break;
            case "ArrowUp":
                if (snake[0].vy !== 1) {
                    snake[0].vx = 0;
                    snake[0].vy = -1;
                }
                break;
            case "ArrowRight":
                if (snake[0].vx !== -1)  {
                    snake[0].vx = 1;
                    snake[0].vy = 0;
                }
                break;
            case "ArrowDown":
                if (snake[0].vy !== -1)  {
                    snake[0].vx = 0;
                    snake[0].vy = 1;
                }
                break;
        }
    }

    function addNode() {
        let last = snake[snake.length-1];
        snake.push({
            x: last.x - box*last.vx,
            y: last.y - box*last.vy,
            col: tailColor,
            vx: last.vx,
            vy: last.vy
        });
    }


    /** SPAWNING **/
    function spawnFood() {
        let cell;
        let flag;
        do {
            flag = false;
            cell = randomCell();
            for (let i = 0; i < snake.length; i++) {
                if (cell.x === snake[i].x && cell.y === snake[i].y)
                    flag = true;
            }
        }
        while (flag);
        cell.col = foodColor;
        return cell;
    }
    function spawnSnake()  {
        let res = [];
        let cell = randomCell();
        res.push({x:cell.x, y: cell.y, col: headColor, vx: 0, vy: 0});
        return res;
    }
    /** **/

    /** DRAWING **/
    function drawElement(elem) {
        c.fillStyle = elem.col;
        c.beginPath();
        c.rect(elem.x, elem.y, box, box);
        c.fill();
    }
    function drawField() {
        for (let i = 0; i < kw; i++) {
            for (let j = 0; j < kh; j++) {
                (i + j) % 2 === 0
                    ? c.fillStyle = cellColor1
                    : c.fillStyle = cellColor2;
                c.beginPath();
                c.rect(box * i, box * j, box, box);
                c.fill();
            }
        }
    }
    function drawSnake() {
        update();
        for (let i = 0; i < snake.length; i++)
            drawElement(snake[i]);
    }
    /** **/

    /** UTILITIES **/
    function randomCell() {
        let rCell = {x: 0, y: 0};
        let t;
        t = Math.random() * kw * box;
        rCell.x = t - (t % box);
        t = Math.random() * kh * box;
        rCell.y = t - (t % box);
        return rCell
    }
    function gameover(){
        update();
        points = 0;
        $("res").textContent = 0;
        snake = spawnSnake();
        alert("Game Over");
    }
    function update(){
        c.clearRect(0, 0, canvas.width,canvas.height);
        drawField();
        drawElement(food);
    }
    /** **/
}
