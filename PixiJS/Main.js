var stats
var stage;
var renderer
var tile;
var first_tile;
var second_tile;
var gameGrid;
var logo;
var pause_timer;
var defaultImage;
var pairsFinished = 8;
var progressBarContainer;
var progressBarTimer;
var timer;
var timer_txt;
var nCount = 60;
var colordeck = new Array(1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8);
var assetFolder = "../assets/";

   
function init(){

    // create an new instance of a pixi stage and make it Interactive (mandatory)
	stage = new PIXI.Stage(0xffffff, true);	
	renderer = PIXI.autoDetectRenderer(800, 500);	
	document.body.appendChild(renderer.view);	
	initStats();
	initGame();
	drawTimerBar();
	requestAnimFrame( tick );	
}

function initStats(){

	stats = new Stats();
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "absolute";
	stats.domElement.style.top = "280px";
	stats.domElement.style.left = "375px";
}


function tick() {
		
		stats.begin();
	    requestAnimFrame( tick );	   
	    renderer.render(stage);
	    stats.end();
}

function initGame() {

	//Game background
	background = new PIXI.Graphics();
    background.beginFill(0xcccccc);  
    background.drawRect(0, 0, 328, 328);
    stage.addChild(background);

	//create logo
    logo = PIXI.Sprite.fromImage(assetFolder+"logo_pixiJS.png");    
    logo.position.x = 450;
    logo.position.y = 100;
    logo.anchor.x = 0.5;
    logo.anchor.y = 0.5;
    stage.addChild(logo);

   
    TweenLite.fromTo(logo, 1.5, {alpha:0, width:0, height:0}, {alpha:1, width:160, height:160, ease:"Elastic.easeOut"});


	//Game Grid container for all Tiles.
	gameGrid = new PIXI.DisplayObjectContainer();	
	stage.addChild(gameGrid);

	for (var x=1; x<=4; x++) {
		for (var y=1; y<=4; y++) {
			var random_card = Math.floor(Math.random()*colordeck.length);			
    		defaultImage = PIXI.Sprite.fromImage(assetFolder+"color_default.png");
			tile = new PIXI.DisplayObjectContainer();
			tile.col = colordeck[random_card];
			colordeck.splice(random_card,1);
			tile.addChild(defaultImage);
			tile.position.x = (x-1)*82;
			tile.position.y = (y-1)*82;	
			gameGrid.addChild(tile);
			tile.setInteractive(true);
			tile.buttonMode = true;
			tile.click = tile_clicked;	

		}
	}

}


function tile_clicked(){
   				
	var clicked = this //where 'this' is the Box we just have clicked. Weird Javascript!!! :P

	
	//clicked.scale.x = 0.9;
	//clicked.scale.y = 0.9;
	//TweenMax.to(logo.width, 0.5, {width:4, ease:"Linear.easeOut"});
	
	
	//TweenMax.to(clicked.position, 2, {x:400});
	//TweenMax.to(clicked.position, 2, {x:40, y:90});


	
	if (first_tile == null) {
		
		first_tile = clicked;
							
		switch( clicked.col ) {
			
			case 1: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"banana.png") ); break;
			case 2: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"cherry.png") );break;
			case 3: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"grape.png") );break;
			case 4: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"lemon.png") );break;
			case 5: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"melon.png") );break;
			case 6: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"orange.png") );break;
			case 7: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"strawberry.png") );break;
			case 8: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"watermelon.png") );break;
		}

		
		
		
		
		
	} else if (second_tile == null && first_tile != clicked) {
		
		second_tile = clicked;
		
		switch( clicked.col ) {

			case 1: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"banana.png") ); break;
			case 2: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"cherry.png") );break;
			case 3: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"grape.png") );break;
			case 4: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"lemon.png") );break;
			case 5: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"melon.png") );break;
			case 6: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"orange.png") );break;
			case 7: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"strawberry.png") );break;
			case 8: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"watermelon.png") );break;
		}

		
		
		//Check if we have a pair or not.
		if (first_tile.col == second_tile.col) {
			

			console.log("PAIR FOUND")
			
			if(pairsFinished != 1) {
				pairsFinished--;
				setTimeout(remove_tiles, 1000);
				console.log("TO PAIR: " + pairsFinished);
			
			} else {
				
				console.log("YOU WON!");
				timer.stop();
				stage.removeChild(progressBarTimer);
				timer_txt.setText("Well Done!");
				stage.removeChild(gameGrid);
				//showWinnerSpriteSheet();
					
			}
		
		} else {

			console.log("NO PAIR FOUND")
			setTimeout(reset_tiles, 1000);
		}
	}	

}



function drawTimerBar(){

	progressBarTimer = new PIXI.Graphics();	 
	progressBarTimer.beginFill(0xaaaaff);
	progressBarTimer.drawRect(0, 0, 250, 20);
	progressBarTimer.position.y = 400;
	progressBarTimer.position.x = 40;
	stage.addChild(progressBarTimer);	
	timer_txt = new PIXI.Text(nCount, {font:"40px Handycandy", fill:"#000000"});
	timer_txt.position.x = 50;
	timer_txt.position.y = progressBarTimer.position.y + 20;
	stage.addChild(timer_txt);
	timer = new Timer(1000, 60);
    timer.addEventListener(TimerEvent.TIMER, onTick)
    timer.addEventListener(TimerEvent.TIMER_COMPLETE, onTimerComplete)
    timer.start();

}

function onTick(event){

	nCount--;
	timer_txt.setText(nCount);
	progressBarTimer.scale.x = 1 - event.target.currentCount / 60;
	
}

function onTimerComplete(event){
	timer_txt.setText("Time's Up!");
}

function reset_tiles() {
	
	first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"color_default.png") );
	second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"color_default.png") );
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
			
	//To be done.
	
}