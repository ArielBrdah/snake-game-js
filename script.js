
window.onload   =   function(){

        var canvasWidth         =   900;
        var canvasHeight        =   600;
        var ctx;
        var delay               =   100;
        const blockSize         =   30;
        var snakee;
        var applee;
        var widthInBlocks           =   canvasWidth/blockSize;
        var heightInBlocks          =   canvasHeight/blockSize;
        var score;
        var color_count             = 0;
        var timeout;

        init();

        function init() {
        var canvas              =   document.createElement('canvas');
        canvas.width            =   canvasWidth;
        canvas.height           =   canvasHeight;
        canvas.style.border     =   "30px solid #aabbff";
        canvas.style.margin     =   "50px auto";
        canvas.style.display    =   "block";
        canvas.style.background =   "#abdddd";
        document.body.appendChild(canvas);

        ctx                 =   canvas.getContext('2d');
        
        snakee              =   new Snake(  [[6, 4], [5, 4], [4, 4], [3, 4]], "right" );
        applee              =   new Apple([10,10]);
        score               =   0;
        refreshCanvas();

    }


        function refreshCanvas(){
        
                // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.advance();
         if(snakee.checkCollision())
            {
               gameOver();
            }
            else{
                if(snakee.isEatingApple(applee)){

                    score++;
                
                    snakee.ateApple =   true;
                do{
                        applee.setNewPosition();

                }while(applee.isOnSnake(snakee));
            }
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                drawScore();
                snakee.draw();
                applee.draw();
                timeout = setTimeout(refreshCanvas,delay);
            }
    }

        function drawBlock(ctx,     position){
            var x   =   position[0] * blockSize;
            var y   =   position[1] * blockSize;

            ctx.fillRect(x,     y,  blockSize,  blockSize);
            ctx.strokeRect(x,   y,  blockSize,  blockSize);
    }


        function drawScore(){

            ctx.save();
            ctx.font = "bold 200px sans-serif";
            ctx.fillStyle = "#111aaa";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var centreX = canvasWidth / 2;
            var centreY = canvasHeight / 2;
            ctx.fillText(score.toString(), centreX, centreY);

            ctx.font = "bold 200px sans-serif";
            ctx.strokeStyle = "#eeeeee";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var centreX = canvasWidth / 2;
            var centreY = canvasHeight / 2;
            ctx.lineWidth   =   3;
            ctx.strokeText(score.toString(), centreX, centreY);


            ctx.restore();

        }

        restart =   ()  =>  {
            snakee              =   new Snake(  [[6, 4], [5, 4], [4, 4], [3, 4]], "right" );
            applee              =   new Apple([10,10]);
            score               =   0;
            color_count         =   0;
            this.clearTimeout(timeout);
            refreshCanvas();
        }

        gameOver = () =>{
            ctx.save();
            ctx.font = "bold 70px sans-serif";
            ctx.fillStyle = "#111aaa";//"#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            var centreX = canvasWidth / 2;
            var centreY = canvasHeight / 2;
            ctx.strokeText("Game Over", centreX, centreY - 180);
            ctx.fillText("Game Over", centreX, centreY - 180);
            ctx.font = "bold 30px sans-serif";
            ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
            ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
            ctx.restore();
        }
    
    
        function Snake(body, direction){

            this.body           =   body;
            this.direction      =   direction;
            this.ateApple       =   false;
            this.draw           =   function(){
            
                ctx.save();
                ctx.fillStyle       =   "#aabb09";
                ctx.strokeStyle     =   "#ffffff    ";
                ctx.lineWidth       =   3;

                for( var i = 0  ;   i   <   this.body.length    ;   i++ ){
                     
                    drawBlock(ctx,  this.body[i]);
                    
                }
                            
                ctx.restore();
            };

            this.advance = function(){

                var nextPosition        =   this.body[0].slice();
                switch(this.direction){
                    case "left":
                        nextPosition[0]     -=  1;
                        break;
                    case "right":
                        nextPosition[0]     +=  1;
                        break;
                    case "up":
                        nextPosition[1]     -=  1;
                        break;
                    case "down":
                        nextPosition[1]     +=  1;
                        break;
                    default:
                        throw("invalid direction");
                }
                this.body.unshift(nextPosition);
                if(!this.ateApple)
                    this.body.pop();
                else 
                    this.ateApple   =   false;
                
            };
        
            this.setDirection = function(newDirection){
                var allowedDirections;
                switch(this.direction){    
                    case "left":
                    case "right":
                        allowedDirections   =   ["up","down"];
                        break;
                    case "up":
                    case "down":
                        allowedDirections   =   ["left","right"];
                        break;
                    default:
                        throw("invalid direction");
                }
                if( allowedDirections.indexOf(newDirection) > -1){
                    this.direction          =       newDirection;
                }
            };

            this.checkCollision = function(){

                var wallCollision   =       false;
                var snakeCollision  =       false;

                // REVOIR CET PORTION DE CODE
                var head            =       this.body[0];
                var rest            =       this.body.slice(1);
                var snakeX          =       head[0];
                var snakeY          =       head[1];
                // FIN DE LA PORTION DE CODE

                
                var minX            =       0;
                var minY            =       0;
                var maxX            =       widthInBlocks   -   1;
                var maxY            =       heightInBlocks  -   1;
                var isNotBetweenHorizontalWalls =   snakeX  <   minX    ||  snakeX  >   maxX;
                var isNotBetweenVerticalWalls   =   snakeY  <   minY    ||  snakeY  >   maxY;



                if( isNotBetweenHorizontalWalls ||  isNotBetweenVerticalWalls  ){
                    wallCollision    =   true;
                }

                // REVOIR CET PORTION DE CODE
                for (var i = 0; i < rest.length; i++) {
                   
                    if( snakeX  === rest[i][0]  &&  snakeY  === rest[i][1] ){
                        snakeCollision      =       true;
                    }
                    
                }

                return snakeCollision   ||  wallCollision;
            };

            this.isEatingApple = function(appleToEat){

                var head    =   this.body[0];
                if( head[0] === appleToEat.position[0]
                    &&  head[1] === appleToEat.position[1] ){
                        return true;
                    }else{
                        return false;
                    }
            };

    }


        function Apple(position){

                this.position       =       position;
                this.draw           =   function(){


                    ctx.save();
                    var color       =   ["#00ff00","#00ff00","006600","#006600","#006600","#006600","#006600","#006600","#006600","#006600","#006600",];                    
                    ctx.fillStyle       =       color[color_count%color.length];
                    ctx.beginPath();
                    var radius          =       blockSize/2;
                    var x               =       this.position[0] *   blockSize   +   radius;
                    var y               =       this.position[1] *   blockSize   +   radius;
                    ctx.arc(x,  y,  radius, 0,  Math.PI*2,  true);
                    ctx.fill();
                    
                    ctx.strokeStyle       =       "#fafafa";
                    ctx.beginPath();
                    var radius          =       blockSize/2;
                    var x               =       this.position[0] *   blockSize   +   radius;
                    var y               =       this.position[1] *   blockSize   +   radius;
                    ctx.arc(x,  y,  radius, 0,  Math.PI*2,  true);
                    ctx.lineWidth       =   2;
                    ctx.stroke();
                    
                    color_count++;
                    ctx.restore();
                };

                this.setNewPosition     =   function() {
                    var    newX         =   Math.round(Math.random() * (widthInBlocks - 1));
                    var    newY         =   Math.round(Math.random() * (heightInBlocks - 1));
                    this.position       =   [newX,  newY];
                    
                };
                this.isOnSnake          =   function(snakeToCheck){

                    var isOnSnake       =   false;
                    for( let i = 0; i <snakeToCheck.body.length;i++){
                        if(this.position[0] === snakeToCheck.body[i][0]
                        && this.position[1] === snakeToCheck.body[i][1]){
                            isOnSnake   =   true;
                        }

                    }
                return isOnSnake;
                            };


    }



document.onkeydown  = function handleKeyDown(e){


    var key = e.keyCode;
    var newDirection;

    switch(key){
        case 37:
            newDirection        =       "left";
            break;
        case 38:
            newDirection        =       "up";
            break;
        case 39:
            newDirection        =       "right";
            break;
        case 40:
            newDirection        =       "down";
            break;
        case 32:
            restart();
            return;
        default:
            return;
    }

    snakee.setDirection(newDirection);
};

}