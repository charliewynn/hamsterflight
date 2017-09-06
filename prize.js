//Prize object
	//params    -y, location y=0 means top of screen
	             //type,  `1,2 or 3
function Prize(y, type)
{	
	if(type == 1)
		this.type = "plusbullets";
	if(type == 2)
		this.type = "pluspower";
	if(type == 3)
		this.type = "pluslife";
		
	this.health = 3;
  
	this.height = 75; //height of prize (won't change)
	this.width = 75; //prize width (won't change)
  
	this.x_loc = width + this.width; //prize x location, starts just off screen
	this.y_loc = y; //prize y location
		
	this.x_speed = 7;
	
    //this is used to make the prize flash after being hit
	this.wasJustHitCounter = 0;
		
    //this is for collision with bullets
	this.decreaseHealth = function(amt)
	{
		if(this.health > 0)
		{
			this.health-= amt;
			if(this.health < 0)
				this.health = 0;
			this.wasJustHitCounter = 5;
		}
	}
	
  //this is for collision with player, not collision with bullets
	this.handleCollision = function()
	{
		if(this.type == "plusbullets")
			player.weapon.increaseNumOfBullets();
		else if(this.type == "pluspower")
			player.weapon.increasePower();
		else if(this.type == "pluslife")
			player.increaseLives();
			
		player.score += 1000;//bonus for getting prize
	};
	
	//uses the prize's speed to change their current position
	this.updatePosition = function()
	{
		if(this.wasJustHitCounter > 0)
			this.wasJustHitCounter--;
			
		//after being hit the health goes negative to show the explosion
		if(this.health <= 0)
			this.health--;
			
		this.x_loc -= this.x_speed;
	};
	
	
	//the image for the item
	this.image = new Image();
	if(this.type == "plusbullets")
		this.image.src = "./plusbullets.png";
	else if(this.type == "pluspower")
		this.image.src = "./pluspower.png";
	else if(this.type == "pluslife")
		this.image.src = "./pluslife.png";
	
	//explosion images
	this.hit1 = new Image();
	this.hit1.src = "./hit1.png";
	
	this.hit2 = new Image();
	this.hit2.src = "./hit2.png";
	
	//drawing function for the enemy
	this.draw = function()
	{
		if(this.wasJustHitCounter %2 == 0 && this.health > 0)//this lets them flash if they were just hit
			context.drawImage(this.image, this.x_loc, this.y_loc);
		else if(this.health <= 0 && this.health > -5)//just died
			context.drawImage(this.hit1, this.x_loc, this.y_loc, this.width, this.height);//small explosion
		else if(this.health <= -5)//died a second ago
			context.drawImage(this.hit2, this.x_loc, this.y_loc, this.width, this.height);//big explosion
	};
	
};