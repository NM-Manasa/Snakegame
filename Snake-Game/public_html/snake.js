$(document).ready(function () {
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext("2d");
    var snake = [];

    var min = 0;
    var w;
    var h;




    //Cell width for the snake 
    var cwidth = 10;
    var d = "right";
    var score;
    var length = 5

    var highscore;



    $('.start').click(function () {
        start();
    })


    function start() {
        $('.startgame').hide();
        $('.highscoremsg').html('');
        canvas.width = $('.board').val();
        canvas.height = $('.board').val();
        w = $("#canvas").width();
        h = $("#canvas").height();
        $('.timer-game').find('.value').text(0);
        $('.timer-game').show();

        count_timer = setInterval(timer, 1000);

        ctx.fillStyle = "#efefef";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        //SET SCORE TO 0
        score = 0;
        highscore = localStorage.getItem("highscore");
        //CREATING SNAKE 
        d = "right";
        console.log("I am starting");
        create_snake();

        snake_food();

        if (typeof game_loop != "undefined")
            clearInterval(game_loop);
        game_loop = setInterval(paintSnake, 90);

    }


//Creates actual Snake
    function create_snake() {

        //Set the length of snake
        length = 5;
        snake = [];

        for (var i = length - 1; i >= 0; i--) {

            snake.push({x: i, y: 0});
        }

    }


//Paint the snake
    function paintSnake() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);
        for (var i = 0; i < snake.length; i++)
        {
            var c = snake[i];
            //Lets paint the snake with 10px wide cells 
            paintSnake_cell(c.x, c.y);
        }
        move_Snake();


    }

    function paintSnake_cell(x, y)
    {
        ctx.fillStyle = "#76b900";
        ctx.fillRect(x * cwidth, y * cwidth, cwidth, cwidth);
        ctx.strokeStyle = "white";
        ctx.shadowColor = "black"
        ctx.strokeRect(x * cwidth, y * cwidth, cwidth, cwidth);
    }


    //Create food for snake 

    function snake_food()
    {
        food = {
            x: Math.round(Math.random() * (w - cwidth) / cwidth),
            y: Math.round(Math.random() * (h - cwidth) / cwidth),
        };

    }

    function move_Snake() {

        var nx = snake[0].x;
        var ny = snake[0].y;


        if (d == "right")
            nx++;
        else if (d == "left")
            nx--;
        else if (d == "up")
            ny--;
        else if (d == "down")
            ny++;

        if (nx == -1 || nx == w / cwidth || ny == -1 || ny == h / cwidth || wall_collision(nx, ny, snake))
        {
            console.log("I am dead");
            console.log("My score" + score);
            console.log(highscore);
            if (score > highscore) {

                localStorage.setItem("highscore", score);
                $(".highscoremsg").html("<p>Congratulations! It's your High Score!!</p>" + localStorage.getItem("highscore"));


                stop();


            } else if (score <= 0 || score <= highscore)
            {
                $(".highscoremsg").html("<p>Try again to beat high score.You can do it! Good LUCK</p>");

                stop();
            }



        }

        if (nx == food.x && ny == food.y)
        {
            var tail = {x: nx, y: ny};

            score++;

            snake.push({x: length++, y: 0});

            //Create new food
            snake_food();
        }


        var tail = snake.pop(); //pops out the last cell
        tail.x = nx;
        tail.y = ny;

        snake.unshift(tail);
        for (var i = 0; i < snake.length; i++)
        {
            var c = snake[i];
            //Lets paint 10px wide cells
            paintSnake_cell(c.x, c.y);

        }
        //Paint food
        paintSnake_cell(food.x, food.y);
        
        var score_text = "Score: " + score;
        
        $('.score').text(score_text);

    }

//To Check the Wall collisions of snake
    function wall_collision(x, y, array)
    {

        for (var i = 0; i < array.length; i++)
        {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }


    //Lets add the keyboard controls now
    $(document).keydown(function (e) {
        var key = e.which;
        //We will add another clause to prevent reverse gear
        if (key == "37" && d != "right")
            d = "left";
        else if (key == "38" && d != "down")
            d = "up";
        else if (key == "39" && d != "left")
            d = "right";
        else if (key == "40" && d != "up")
            d = "down";
        //The snake is now keyboard controllable
    });



    function stop() {
        $('.highscoremsg').show();
        clearInterval(game_loop);
        clearInterval(count_timer);
        $('.timer-game').hide();
        $('.startgame').show();

    }



    function timer() {
        var value = parseInt($('#timer').find('.value').text(), 10);
        var min = parseInt($('#mintimer').find('.value').text(), 10);
        console.log(value);

        if (value === 60) {
            min++;
            value = 0;
        }
        else {
            value++
        }

        $('#mintimer').find('.value').text(min);
        $('#timer').find('.value').text(value);

    }



    $(document).on('click', '.restart', function () {


        console.log("RESTARTING");

        length = 5;
        snake = [];
        $(".highscoremsg").html("");
        start();
    });

});



