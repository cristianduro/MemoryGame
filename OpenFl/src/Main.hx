package;

import flash.display.Bitmap;
import flash.display.Sprite;
import flash.events.Event;
import flash.geom.Matrix;
import flash.geom.Rectangle;
import flash.Lib;
import flash.text.AntiAliasType;
import flash.text.TextFieldAutoSize;
import flash.text.TextFormatAlign;
import flash.events.MouseEvent;
import flash.events.TimerEvent;
import flash.text.Font;
import flash.text.TextField;
import flash.text.TextFormat;
import flash.utils.Timer;
import openfl.Assets;
import flash.display.BitmapData;
import spritesheet.AnimatedSprite;
import spritesheet.data.BehaviorData;
import spritesheet.importers.BitmapImporter;
import spritesheet.Spritesheet;

@:font("../assets/font/Handycandy.ttf") class Handycandy extends Font { }
@:bitmap("../assets/smiley.png") class SmileyAnimation extends BitmapData { }
@:bitmap("../assets/color_default.png") class DefaultColor extends BitmapData { }
@:bitmap("../assets/banana.png") class Banana extends BitmapData { }
@:bitmap("../assets/cherry.png") class Cherry extends BitmapData { }
@:bitmap("../assets/grape.png") class Grape extends BitmapData { }
@:bitmap("../assets/lemon.png") class Lemon extends BitmapData { }
@:bitmap("../assets/melon.png") class Melon extends BitmapData { }
@:bitmap("../assets/orange.png") class Orange extends BitmapData { }
@:bitmap("../assets/strawberry.png") class Strawberry extends BitmapData { }
@:bitmap("../assets/watermelon.png") class Watermelon extends BitmapData { }
@:bitmap("../assets/logo_openFL.png") class Logo extends BitmapData { }

/**
 * ...
 * @author Cristian Duro
 */

class Main extends Sprite 
{
	private var first_tile:Color; 
	private var second_tile:Color;
	private var pause_timer:Timer;
	private static var colordeck : Array<Int> = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
	private var timer_txt:TextField;
	private var nCount: Int = 60;
	private var myTimer: Timer;
	private var inited:Bool;
	private var progressBarTimer:Sprite;
	private var gameGrid:Sprite;
	private var pairsFinished:Int = 8;
	private var animated:AnimatedSprite;
	private var lastTime:Int = 0;
	
	/* ENTRY POINT */
	
	function resize(e) 
	{
		if (!inited) init();
		// else (resize or orientation change)
	}
	
	function init() 
	{
		if (inited) return;
		inited = true;
		loadGame();
		drawTimerBar();

	}

	/* SETUP */

	public function new() 
	{
		super();	
		addEventListener(Event.ADDED_TO_STAGE, added);
	}

	function added(e) 
	{
		removeEventListener(Event.ADDED_TO_STAGE, added);
		stage.addEventListener(Event.RESIZE, resize);
		init();		
	}
	
	private function drawTimerBar() {
		
		#if js
			var font = Assets.getFont("../assets/font/Handycandy.ttf");			
		#else
			var font = new Handycandy();
		#end
		
		
		var format:TextFormat = new TextFormat (font.fontName, 40, 0x000000);		
		myTimer = new Timer(1000, 60);		
		myTimer.addEventListener(TimerEvent.TIMER, onTick);
		myTimer.addEventListener(TimerEvent.TIMER_COMPLETE, onTimerComplete);
		myTimer.start();		
		timer_txt = new TextField();
		timer_txt.defaultTextFormat = format;
		timer_txt.autoSize = TextFieldAutoSize.LEFT;
		timer_txt.antiAliasType = AntiAliasType.ADVANCED;
		addChild(timer_txt);
		
		
		progressBarTimer = new Sprite();
        progressBarTimer.graphics.beginFill(0xaaaaff);
        progressBarTimer.graphics.drawRect(0,0,250,20);
	    progressBarTimer.y = 400;
		progressBarTimer.x = 40;
		addChild(progressBarTimer);
		timer_txt.text = Std.string(nCount);
		timer_txt.x = 50;
		timer_txt.y = progressBarTimer.y + 20;
		
	}
	
	
	private function onTick(e:TimerEvent){
		nCount--;
		timer_txt.text = Std.string(nCount);
		progressBarTimer.scaleX = 1 - e.target.currentCount / 60;
	}
	
	
	private function onTimerComplete(event:TimerEvent){
		timer_txt.text="Time's Up!";
	}
	
	
	private function loadGame() {
		
		var background:Sprite = new Sprite();
        background.graphics.beginFill(0xcccccc);
        background.graphics.drawRect(0,0,328,328);
	   	addChild(background);
		
		var logo:Bitmap = new Bitmap(new Logo(0, 0));
		addChild(logo);
		logo.x = 400;
		logo.y = 30;
		
		gameGrid = new Sprite();
		addChild(gameGrid);
		
		
		for (x in 1...5) {
				for (y in 1...5) {
					var random_card = Math.floor(Math.random()*colordeck.length);
					var defaultImage:Bitmap = new Bitmap(new DefaultColor (0, 0));
					var tile: Color = new Color();
					//tile.buttonMode = true;
					tile.col = colordeck[random_card];
					colordeck.splice(random_card,1);					
					tile.x = (x-1)*82;
					tile.y = (y-1)*82;
					tile.addEventListener(MouseEvent.CLICK,tile_clicked);
					tile.addChild(defaultImage);
					gameGrid.addChild(tile);
					
					
					#if js
						tile.useHandCursor = true;			
					#else
						tile.buttonMode = true;
					#end
					
					
					
					
			}
			
		}
	}
		
	private function tile_clicked(event:MouseEvent) {
			
			//trace("CLICKED");
		
			
			var clicked:Color = (event.currentTarget);
			
			if (first_tile == null) {
				first_tile = clicked;
				
				
				switch( clicked.col ) {
					case 1: first_tile.addChild( new Bitmap(new Banana (0, 0)));
					case 2: first_tile.addChild( new Bitmap(new Cherry (0, 0)));
					case 3: first_tile.addChild( new Bitmap(new Grape (0, 0)));
					case 4: first_tile.addChild( new Bitmap(new Lemon (0, 0)));
					case 5: first_tile.addChild( new Bitmap(new Melon (0, 0)));
					case 6: first_tile.addChild( new Bitmap(new Orange (0, 0)));
					case 7: first_tile.addChild( new Bitmap(new Strawberry (0, 0)));
					case 8: first_tile.addChild( new Bitmap(new Watermelon (0, 0)));
				}
				
				
				
			}
			else if (second_tile == null && first_tile != clicked) {
				
				second_tile = clicked;
				
				
				//trace("COLOR:" + clicked.col);
				
				switch( clicked.col ) {
					case 1: second_tile.addChild( new Bitmap(new Banana (0, 0)));
					case 2: second_tile.addChild( new Bitmap(new Cherry (0, 0)));
					case 3: second_tile.addChild( new Bitmap(new Grape (0, 0)));
					case 4: second_tile.addChild( new Bitmap(new Lemon (0, 0)));
					case 5: second_tile.addChild( new Bitmap(new Melon (0, 0)));
					case 6: second_tile.addChild( new Bitmap(new Orange (0, 0)));
					case 7: second_tile.addChild( new Bitmap(new Strawberry (0, 0)));
					case 8: second_tile.addChild( new Bitmap(new Watermelon (0, 0)));
				}
				
				
				if (first_tile.col == second_tile.col) {
					
					if(pairsFinished != 1){
						pairsFinished--;
						pause_timer = new Timer(1000,1);
						pause_timer.addEventListener(TimerEvent.TIMER_COMPLETE,remove_tiles);
						pause_timer.start();
						trace("TO PAIR: " + pairsFinished);
					
					}else {
						
						myTimer.stop();
						removeChild(gameGrid);
						removeChild(progressBarTimer);
						timer_txt.text = "Well Done!";						
						
						showWinnerSpriteSheet();
						
					}
				
				}
				else {
					pause_timer = new Timer(1000,1);
					pause_timer.addEventListener(TimerEvent.TIMER_COMPLETE,reset_tiles);
					pause_timer.start();
				}
			}
		}	
	
		private function showWinnerSpriteSheet():Void {
			
			var spritesheet:Spritesheet = BitmapImporter.create(Assets.getBitmapData("../assets/smiley.png"), 2, 2, 230, 230);
			spritesheet.addBehavior(new BehaviorData("smiley", [0, 1, 2, 3], true));						
			animated = new AnimatedSprite(spritesheet, true);
			animated.showBehavior("smiley");						
			addChild(animated);
			animated.x = 50;
			animated.y = 50;
			addEventListener(Event.ENTER_FRAME, onEnterFrame);													
			trace("GAME FINISHED");
			
		}
		
	public function onEnterFrame(e:Event):Void{
		  var delta = Lib.getTimer()- lastTime;
		  animated.update(delta);
		  lastTime = Lib.getTimer();
	}
	
	private function reset_tiles(event:TimerEvent) {
			
			first_tile.addChild(new Bitmap(new DefaultColor (0, 0)));
			second_tile.addChild(new Bitmap(new DefaultColor (0, 0)));
			first_tile = null;
			second_tile = null;
			pause_timer.removeEventListener(TimerEvent.TIMER_COMPLETE,reset_tiles);
		}
	private function remove_tiles(event:TimerEvent) {
			
			gameGrid.removeChild(first_tile);
			gameGrid.removeChild(second_tile);
			first_tile = null;
			second_tile = null;
			pause_timer.removeEventListener(TimerEvent.TIMER_COMPLETE,remove_tiles);
			
	}
	
	public static function main() 
	{
		// static entry point
		Lib.current.stage.align = flash.display.StageAlign.TOP_LEFT;
		Lib.current.stage.scaleMode = flash.display.StageScaleMode.NO_SCALE;
		Lib.current.addChild(new Main());
	}
}
