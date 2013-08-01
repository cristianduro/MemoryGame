	
var stage;
var tile;
var first_tile;
var second_tile;
var gameGrid;
var pause_timer;
var defaultImage;
var pairsFinished = 8;
var progressBarTimer;
var timer;
var timer_txt;
var nCount = 60;
var colordeck = new Array(1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8);
var assetFolder = "../assets/";
 

function init() {
    
    stage = new createjs.Stage("demoCanvas"); 
    stage.enableMouseOver();
    initStats();
    drawTimerBar();
    initGame();	
    createjs.Ticker.addListener(this);
    createjs.Ticker.setFPS(60);
       
}

//Stats plugins to determinate the FPS an MS refresh.
function initStats(){

	stats = new Stats();
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "absolute";
	stats.domElement.style.top = "280px";
	stats.domElement.style.left = "375px";
}

function tick() {
	stats.begin();
    stage.update();
    stats.end();
} 

function initGame() {

	//Game background
	background = new createjs.Shape();
    background.graphics.beginFill("#cccccc").drawRect(0, 0, 328, 328);
    stage.addChild(background);

    //create logo
    var logo = new createjs.Bitmap(assetFolder+"logo_createJS.png")
   	logo.regX = 80;
    logo.regY = 80;
    logo.x = 450;
    logo.y = 100;
    stage.addChild(logo);

    //animate all the tiles from the grid at the beginning
    TweenLite.fromTo(logo, 1.5, {alpha:0, scaleX:0.5, scaleY:0.5}, {alpha:1, scaleX:1, scaleY:1, ease:"Elastic.easeOut"});	
	
	//Game Grid container for all Tiles.
	gameGrid = new createjs.Container();
	stage.addChild(gameGrid);

	for (var x=1; x<=4; x++) {
		for (var y=1; y<=4; y++) {
			var random_card = Math.floor(Math.random()*colordeck.length);
			defaultImage = new createjs.Bitmap(assetFolder+"color_default.png");
			tile = new createjs.Container();
			tile.col = colordeck[random_card];
			colordeck.splice(random_card,1);
			tile.addChild(defaultImage);
			tile.regX = 41;
   			tile.regY = 41;
			tile.x = (x-1)*82 +41;
			tile.y = (y-1)*82 +41;	
			tile.addEventListener("click", tile_clicked);
			tile.cursor = "pointer";				
			tile.alpha = 0;
			gameGrid.addChild(tile);			

			TweenLite.fromTo(tile, 0.5*x, {alpha:0, scaleX:0, scaleY:0}, {alpha:1, scaleX:1, scaleY:1, ease:"Bounce.easeOut"});
		}
	}
}

function drawTimerBar(){

	progressBarTimer = new createjs.Shape();
    progressBarTimer.graphics.beginFill("#aaaaff").drawRect(0, 0, 250, 20);
	progressBarTimer.y = 400;
	progressBarTimer.x = 40;
	stage.addChild(progressBarTimer);	
	timer_txt = new createjs.Text(nCount, "40px Handycandy", "#000000");
	timer_txt.x = 50;
	timer_txt.y = progressBarTimer.y + 20;
	stage.addChild(timer_txt);
	timer = new Timer(1000, 60);
    timer.addEventListener(TimerEvent.TIMER, onTick)
    timer.addEventListener(TimerEvent.TIMER_COMPLETE, onTimerComplete)
    timer.start();

}


function onTick(event){

	nCount--;
	timer_txt.text = nCount;
	progressBarTimer.scaleX = 1 - event.target.currentCount / 60;
	
}

function onTimerComplete(event){
	timer_txt.text="Time's Up!";
}


function tile_clicked(event){

	var clicked = event.target;

	TweenLite.fromTo(clicked, 0.2, {scaleX:1, scaleY:1}, {scaleX:0.9, scaleY:0.9, ease:"Linear.easeOut"});


	if (first_tile == null) {
					
		first_tile = clicked;
										
		switch( clicked.col ) {
			
			case 1: first_tile.addChild( new createjs.Bitmap(assetFolder+"banana.png") ); break;
			case 2: first_tile.addChild( new createjs.Bitmap(assetFolder+"cherry.png") );break;
			case 3: first_tile.addChild( new createjs.Bitmap(assetFolder+"grape.png") );break;
			case 4: first_tile.addChild( new createjs.Bitmap(assetFolder+"lemon.png") );break;
			case 5: first_tile.addChild( new createjs.Bitmap(assetFolder+"melon.png") );break;
			case 6: first_tile.addChild( new createjs.Bitmap(assetFolder+"orange.png") );break;
			case 7: first_tile.addChild( new createjs.Bitmap(assetFolder+"strawberry.png") );break;
			case 8: first_tile.addChild( new createjs.Bitmap(assetFolder+"watermelon.png") );break;
		}					
					
	} else if (second_tile == null && first_tile != clicked) {
					
		second_tile = clicked;
					
		switch( clicked.col ) {
		
			case 1: second_tile.addChild( new createjs.Bitmap(assetFolder+"banana.png") ); break;
			case 2: second_tile.addChild( new createjs.Bitmap(assetFolder+"cherry.png") );break;
			case 3: second_tile.addChild( new createjs.Bitmap(assetFolder+"grape.png") );break;
			case 4: second_tile.addChild( new createjs.Bitmap(assetFolder+"lemon.png") );break;
			case 5: second_tile.addChild( new createjs.Bitmap(assetFolder+"melon.png") );break;
			case 6: second_tile.addChild( new createjs.Bitmap(assetFolder+"orange.png") );break;
			case 7: second_tile.addChild( new createjs.Bitmap(assetFolder+"strawberry.png") );break;
			case 8: second_tile.addChild( new createjs.Bitmap(assetFolder+"watermelon.png") );break;
		}
					
					
		if (first_tile.col == second_tile.col) {
						
			console.log("PAIR FOUND");

			moveToTop(first_tile);
			moveToTop(second_tile);
			TweenLite.to(first_tile, 0.2, {x:100, y:150, scaleX:1.5, scaleY:1.5, ease:"Linear.easeIn"})
			TweenLite.to(second_tile, 0.2, {x:250, y:150, scaleX:1.5, scaleY:1.5, ease:"Linear.easeIn"})	

						
			if(pairsFinished != 1) {
			
				pairsFinished--;
				setTimeout(remove_tiles, 1000);
				console.log("TO PAIR: " + pairsFinished);
						
			} else {
							
				console.log("YOU WON!");
				timer.stop();
				stage.removeChild(progressBarTimer);
				timer_txt.text = "Well Done!";
				stage.removeChild(gameGrid);
				showWinnerSpriteSheet();
								
			}
					
		} else {
			
			console.log("NO PAIR FOUND")
			TweenLite.to(first_tile, 0.2, {delay:1, scaleX:1, scaleY:1})
			TweenLite.to(second_tile, 0.2, {delay:1, scaleX:1, scaleY:1})
			setTimeout(reset_tiles, 1000);
		}
	}	


}


function moveToTop(mc){ mc.parent.setChildIndex(mc, mc.parent.getNumChildren()-1); }


function reset_tiles() {
	

	first_tile.addChild( new createjs.Bitmap(assetFolder+"color_default.png") );
	second_tile.addChild( new createjs.Bitmap(assetFolder+"color_default.png") );
	first_tile = null;
	second_tile = null;
	
}


function remove_tiles() {
			
	gameGrid.removeChild(first_tile);
	gameGrid.removeChild(second_tile);
	first_tile = null;
	second_tile = null;
			
}

function showWinnerSpriteSheet() {
			
	var data = {
	     images: [assetFolder+"smiley.png"],
	     frames: {width:230, height:233},
	     animations: {smile:[0,1,2,3]}
	};

	var spriteSheet = new createjs.SpriteSheet(data);
	var animation = new createjs.BitmapAnimation(spriteSheet);
	stage.addChild(animation);
	animation.x = 50;
	animation.y = 50;
	animation.gotoAndPlay("smile");
	console.log("GAME FINISHED")
	
}