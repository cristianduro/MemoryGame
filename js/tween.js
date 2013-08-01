/*
Copyright (c) 2013 Marian Euent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


/*
	@param {Object} object: Any object you want to tween. For example: PIXI.Sprite
	@param {String} property: the property which needs to be changed. Use "property.property.property..." if the property is little deeper. Pass "" to create a Wait-Tween
	@param {float} value: targetValue of tweening
	@param {int} frames: duration of the tween in frames.
	@param {boolean} autostart: starting when created? Set to false if you use it with ChainedTween
	
	use examples:
	new Tween(sprite, "position.x", 100, 60, true);
	new Tween(sprite.position, "x", 100, 60, true);
	
*/
function Tween(object, property, value, frames, autostart){
	this.object = object;
	
	var properties = property.split(".");
	this.property = properties[properties.length-1];
	for(var i=0;i<properties.length -1; i++){
		this.object = this.object[properties[i]]
	}
	
	this.targetValue = value;
	this.startValue;
	this.active = autostart;
	this.currentFrame = 0;
	this.endFrame = frames;
	this.onComplete;
	this.onCompleteParams;
	this.easing = Tween.noEase;
	
	Tween.tweens.push(this);
}

Tween.prototype.setOnComplete = function(callback, parameters){
	this.onComplete = callback;
	this.onCompleteParams = parameters;
}

Tween.prototype.start = function(){
	this.active = true;
}

Tween.prototype.initIterations = function(){
	if(this.property != ""){
		this.startValue = this.object[this.property];
		this.targetValue = this.targetValue - this.object[this.property];
	}
}

Tween.prototype.update = function(){
	if(!this.active){
		return false;
	}
	if(this.currentFrame == 0){
		this.initIterations();
	}
	this.currentFrame ++;
	if(this.currentFrame <= this.endFrame){
		if(this.property != ""){
			var oldValue = this.object[this.property];
			var newValue = this.easing(this.currentFrame, this.startValue, this.targetValue, this.endFrame);
			this.object[this.property] = newValue;
		}
		return false;
	}else{
		this.active = false;
		if(this.onComplete != null){
			this.onComplete(this.onCompleteParams);
			
		}
		return true;
	}
}

Tween.tweens = [];
// Call this every Frame of your Game/Application to keep the tweens running.
Tween.runTweens = function(){
	for(var i=0;i < Tween.tweens.length;i++){
		var tween = Tween.tweens[i];
		if(tween.update()){
			var index = Tween.tweens.indexOf(tween);
			if(index != -1){
				Tween.tweens.splice(index, 1);
			}
			i--;
		}
	}
};

// EASING
// use example:
// var tween = new Tween(sprite, "alpha", 0, 60, true);
// tween.easing = Tween.outElastic;

Tween.noEase = function(t, b, c, d) {
	t/=d;
	return b+c*(t);
}

Tween.outElastic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(33*tc*ts + -106*ts*ts + 126*tc + -67*ts + 15*t);
}

Tween.inElastic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(56*tc*ts + -105*ts*ts + 60*tc + -10*ts);
}

Tween.inOutQuintic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
}

Tween.inQuintic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(tc*ts);
}

Tween.outQuintic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(tc*ts + -5*ts*ts + 10*tc + -10*ts + 5*t);
}

Tween.inCubic = function(t, b, c, d) {
	var tc=(t/=d)*t*t;
	return b+c*(tc);
}

Tween.inOutCubic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(-2*tc + 3*ts);
}

Tween.outCubic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(tc + -3*ts + 3*t);
}

// CHAINED TWEEN

/*
	@param {Array} tweens: Array of Tweens.
	
	example:
	var tween1 = new Tween(sprite, "position.x", 100, 60, false);
	var tween2 = new Tween(sprite, "position.x", 0, 60, false);
	new ChainedTween([tween1, tween2]);
*/
function ChainedTween(tweens){
	this.tweens = tweens;
	Tween.tweens.push(this);
}

ChainedTween.prototype.update = function(){
	if(this.tweens.length == 0){
		return true;
	}
	var currentTween = this.tweens[0];
	if(!currentTween.active){
		currentTween.start();
	}
	var finished = currentTween.update();
	if(finished){
		this.tweens.splice(0,1);
	}
	return false;
}

// TODO: COMBINED TWEEN
function CombinedTween(tweens){
}

CombinedTween.prototype.start = function(){
}

CombinedTween.prototype.update = function(){
}