//enemy object
	//note enemies don't go away when health reaches 0;
	//their health starts to automatically go down to keep track of what explosion image to show, at health = -10 the updateGame loop in gamemechanics removes it
	
//params
  //y position, --they all start at the same x position
  //x_speed -- how fast they move left
  //y_speed how fast they move up/down
  //changesDir, whether or not it 'bounces' off the top and bottom of the screen
function Enemy(y, x_speed, y_speed, changesDir)
{
	this.health = 3;//all enemies take 3 shots to kill (with the red bullets)
	
	this.height = 78; //height of enemy (won't change)
	this.width = 173; //enemy width (won't change)
	this.x_loc = width + this.width; //enemy x location, starts just off screen
	this.y_loc = y; //enemy y location
	
	//here min means how low to the ground, so min_y_loc is greater than max_y_loc
	this.min_y_loc = height - this.height - 10; //minimum y location //just shy of the bottom
	this.max_y_loc = 10; //max y location //just shy of the top
	
	this.x_speed = x_speed;
	
	this.y_speed = y_speed; //starting y speed, stores y speed
	this.changesDir = changesDir;
	
	//keeps track of if the enemy was just hit, so we can make it flash indicating so
	this.wasJustHitCounter = 0;
	
	//called when enemy is hit with a bullet
	this.decreaseHealth = function(amt)
	{
		if(this.health > 0)
		{
			this.health-=amt;
			
			if(this.health < 0) //if amt was > 1 we may need make this adjustment
				this.health = 0;
				
			this.wasJustHitCounter = 3;
		}
		
		if(this.health == 0)//if the last shot killed the enemy,
		{
		  player.score += 1500;
		  player.kills++;
		}
	}
	
	//uses the enemy's speed to change their current position
	this.updatePosition = function()
	{
		//decrement the wasJustHitCounter //thing that makes enemy flash
		if(this.wasJustHitCounter > 0)
			this.wasJustHitCounter--;
			
		//continue the dying sequence by going into negative health
		if(this.health <= 0)
			this.health--;
			
		//make sure the enemy isn't outside of the min/max height before changing position
		if(  (this.y_loc > this.max_y_loc && this.y_speed > 0) || (this.y_loc <= this.min_y_loc && this.y_speed < 0))
			this.y_loc -= this.y_speed/10; //remember y_loc increasing means going down!
		else
			this.y_speed = -this.y_speed;
			
		//advance left
		this.x_loc -= this.x_speed;
	};
	
	//main image for enemy
	this.image = new Image();
	if(Math.floor((Math.random()*2)) == 0)//randomly choose a cat image to use, there's only two to choose from
		this.image.src = "./enemy1.png";
	else
		this.image.src = "./enemy2.png";
	
	
	//small explosion
	this.hit1 = new Image();
	this.hit1.src = "./hit1.png";
	
	//larger explosion
	this.hit2 = new Image();
	this.hit2.src = "./hit2.png";
	
	//drawing function for the enemy
	this.draw = function()
	{
		if(this.wasJustHitCounter == 0 && this.health > 0)//this lets them flash if they were just hit
			context.drawImage(this.image, this.x_loc, this.y_loc);
		else if(this.health <= 0 && this.health > -5)//just died
			context.drawImage(this.hit1, this.x_loc, this.y_loc, this.width, this.height);//small explosion
		else if(this.health <= -5)//died a second ago
			context.drawImage(this.hit2, this.x_loc, this.y_loc, this.width, this.height);//big explosion
	};
	
};