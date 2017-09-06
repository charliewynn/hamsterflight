//hairball Object
  //params
	//position x,y
	//velocity vector, x_speed, y_speed
	//changesDir is always 0, may want to change this later so I kept the option in

function Hairball(x, y, x_speed, y_speed, changesDir)
{
	this.health = 2;
	
	this.height = 95; //height of hairball (won't change)
	this.width = 88; //hairball width (won't change)
	this.x_loc = x; //hairball x location, starts just off screen
	this.y_loc = y; //hairball y location
	
	this.min_y_loc = height - this.height - 10; //minimum y location
	this.max_y_loc = 10; //max y location
	
	this.x_speed = x_speed;
	
	this.y_speed = y_speed; //starting y speed, stores y speed
	this.max_y_speed = 80; //y speed limit
	this.y_idle = -40; //gravity
	this.changesDir = changesDir;
	
	this.rotateAmt = 0;
	this.wasJustHitCounter = 0;
		
	this.decreaseHealth = function(amt)
	{
		if(this.health > 0)
		{
			this.health-=amt;
			
			if(this.health < 0) //if amt was > 1 we may need make this adjustment
				this.health = 0;
				
			this.wasJustHitCounter = 3;
		}
		if(this.health == 0)
		  player.score += 1000;
		  player.kills++;
	}
	
	//uses the hairball's speed to change their current position
	this.updatePosition = function()
	{
		//increment the rotation amount
		this.rotateAmt = (this.rotateAmt + Math.PI/16) % (Math.PI*2)
		
		if(this.wasJustHitCounter > 0)
			this.wasJustHitCounter--;
			
		//continue the dying sequence by going into negative health
		if(this.health <= 0)
			this.health--;
			
		//make sure the hairball isn't outside of the min/max height before changing position
		if(  (this.y_loc > this.max_y_loc && this.y_speed > 0) || (this.y_loc <= this.min_y_loc && this.y_speed < 0))
			this.y_loc -= this.y_speed/10; //remember y_loc increasing means going down!
		else
			this.y_speed = 0-this.y_speed;
		this.x_loc -= this.x_speed;
	};
	
	
	//main hairball image
	this.image = new Image();
		this.image.src = "./hairball.png";
		
	this.hit1 = new Image();
	this.hit1.src = "./hit1.png";
	
	this.hit2 = new Image();
	this.hit2.src = "./hit2.png";
	
	//drawing function for the hairball
	this.draw = function()
	{
		if(this.wasJustHitCounter == 0 && this.health > 0)//this lets them flash if they were just hit
		{
			context.save();
				context.translate(this.x_loc + this.width/2, this.y_loc + this.height/2);//translate the canvas to be at the middle of the hairball
				context.rotate(this.rotateAmt);//rotate canvas by hairball rotation amount
				
				context.drawImage(this.image, -this.width/2, -this.height/2);//draw center of image at the center of the hairball
			context.restore();
		}
		else if(this.health <= 0 && this.health > -5)//just died
			context.drawImage(this.hit1, this.x_loc, this.y_loc, this.width, this.height);//small explosion
		else if(this.health <= -5)//died a second ago
			context.drawImage(this.hit2, this.x_loc, this.y_loc, this.width, this.height);//big explosion
	};
	
};