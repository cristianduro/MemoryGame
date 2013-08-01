var TimerEvent = function(type, timer)
{
	this.type = type;
	this.target = timer;
}
TimerEvent.TIMER = 'TimerEvent.TIMER';
TimerEvent.TIMER_COMPLETE = 'TimerEvent.TIMER_COMPLETE';

var Timer = function(delay, repeatCount)
{
	this.init(delay, repeatCount);
}
Timer.prototype =
{
	init: function(delay, repeatCount)
	{
		this.delay = delay;
		this.repeatCount = repeatCount || 0;
		
		this.interval = null;
		this.running = false;
		this.currentCount = 0;
		this.listeners = [];
	},
	addEventListener: function(type, listener)
	{
		this.listeners[this.listeners.length] = { type: type, fn: listener };
	},
	removeEventListener: function(type, listener)
	{
		for(var i in this.listeners)
		{
			if(this.listeners[i].type == type
			&& String(this.listeners[i].fn) == String(listener.fn))
			{
				this.listeners[i] = null;
			}
		}
	},
	reset: function()
	{
		this.stop(true);
	},
	start: function()
	{
		if(this.running)
		{
			return;
		}
		this.running = true;
		
		var self = this;
		this.interval = setInterval(function(){ self.iterate() }, this.delay);
	},
	stop: function(clearCount)
	{
		this.running = false;
		
		if(clearCount)
		{
			this.currentCount = 0;
		}
		if(this.interval)
		{
			clearInterval(this.interval);
		}
	},
	iterate: function()
	{
		this.currentCount++;
		if(!this.repeatCount || this.currentCount <= this.repeatCount)
		{
			this.dispatchEvent(TimerEvent.TIMER);
			if(this.currentCount == this.repeatCount)
			{
				this.dispatchEvent(TimerEvent.TIMER_COMPLETE);
			}
		}
		else
		{
			this.stop();
		}
	},
	dispatchEvent: function(type)
	{
		for(var i in this.listeners)
		{
			if(this.listeners[i] && this.listeners[i].type == type)
			{
				this.listeners[i].fn(new TimerEvent(type, this));
			}
		}
	}
}