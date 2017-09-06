//player object
//params     y the location to start the player at, y = 0 is top of screen
function Player(y)
{
  //player status
	this.score = 0; //player's score
	this.kills = 0; //player's kills
	this.bossKills = 0;
	this.weapon = new Weapon(); //player's weapon
	this.lives = 3; //current lives
	this.maxLives = 5; //max lives
	
  //dimensions
	this.height = 70; //height of player (won't change)
	this.width = 110; //player width (won't change)
  
  //location
	this.x_loc = 50; //player's x position (shouldn't ever change)
	this.y_loc = y; //player's y location (will change a lot)
	this.min_y_loc = height - this.height - 10; //minimum y location
	this.max_y_loc = 25; //max y location
	
  //speed
	this.y_speed = -60; //starting y speed, stores y speed
	this.max_y_speed = 100; //y speed limit
	this.y_idle = -60; //gravity
  
	
  //how long to make player invincible after losing a life, 40 = 1 second b/c we're running 40 frames/sec     1000/25 = 40   we're using setTimeout with 25 in redraw loop
	this.invincibilityTimeAfterCollision = 40;
	this.isInvincible = function() { return this.invincibilityCounter > 0; };
	
	//keep track of if the player was hit recently and should be invincible
	this.invincibilityCounter = 0;
	
	//this is called if the player collided with an enemy
	this.handleCollision = function()
	{
		//if the player is invincible from being hit recently, then do nothing
		if(this.invincibilityCounter > 0)
			return;
		
		//otherwise, lose a life
		this.lives--;
    
    //lose weapons upgrades
		this.weapon.decreaseNumOfBullets();
		this.weapon.decreasePower();
    
    //become invincible
		this.invincibilityCounter = this.invincibilityTimeAfterCollision;
	};
	
  //this is called if you get a 1-up prize
	this.increaseLives = function()
	{
		if(this.lives < this.maxLives)
			this.lives ++;
	};
	
	//if the spacebar was pressed this will be called
	this.boost = function()
	{
		if(this.y_speed < this.max_y_speed)//if we aren't over the max speed yet
			this.y_speed += 24;//y_loc-- makes ship rise
	};
	
	//uses the player's speed to change their current position
	this.updatePosition = function()
	{
		//decrement the player's invincibility time
		if(this.invincibilityCounter > 0)
			this.invincibilityCounter--;
			
		//make sure the player isn't outside of the min/max height before changing position
		if(  (this.y_loc > this.max_y_loc && this.y_speed > 0) || (this.y_loc <= this.min_y_loc && this.y_speed < 0))
			this.y_loc -= this.y_speed/10; //remember y_loc increasing means going down!
			
		//always have the player falling a little
		if(this.y_speed > this.y_idle)
			this.y_speed -= 15;
	};
	
	//drawing function for the player
	this.draw = function()
	{
		//make player flash if invincible by cutting out every other frame
		if(this.invincibilityCounter % 2 == 0)
    {
			context.drawImage(this.getImage(), this.x_loc, this.y_loc);
      this.weapon.draw();
    }
	};
	
	//definiton of the player images
	//jetpack off
	this.power0 = new Image();
	this.power0.src = "./power0.png";
	
	//jetpack on low flame
	this.power1 = new Image();
	this.power1.src = "./power1.png";
	
	//jetpack on high flame
	this.power2 = new Image();
	this.power2.src = "./power2.png";
	
	//determins the current image that should represent the player
	this.getImage = function()
	{
		if(this.y_loc >= this.min_y_loc) //player on the ground  //jetpack with no flame
			return this.power0;
		if(this.y_speed > 0 && this.y_speed <= this.max_y_speed) //player off the ground and accelorating //big flame
			return this.power2;
		return this.power1; //player at max speed and off ground, having this set to the lower fire image makes the image flutter when at max acceration
	};
};