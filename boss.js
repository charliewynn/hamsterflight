//boss object,
//there will only be one boss at a time
//params
  //health -the max health of the boss
  //bonus - points player earns by defeating the boss
  //hairballRate - how often the boss fires
  
//when the boss dies it's health goes into the negatives, that's how we know what explosion image to use
//when the boss's health get's to -10 the updateGame loop in gamemechanics
function Boss(health, bonus, hairballRate)
{
	this.health = 0;//start health off at 0 so we can 'fill' it up when the boss appears
	this.maxHealth = health;
	this.fillingHealth = true;//if the boss just appeared and we are 'filling' his health
	
	this.bonus = bonus;
	
	this.height = 200; //height of enemy (won't change)
	this.width = 195; //enemy width (won't change)
	this.x_loc = width + this.width; //enemy x location, starts just off screen
	this.y_loc = 100; //enemy y location could be set randomly, but 100 looks ok!
	
	//set the min/max y location the boss can travel to
	this.min_y_loc = height - this.height - 10; //minimum y location
	this.max_y_loc = 10; //max y location
	
	//the min/max x the boss can travel to,  he starts being past the max x (off screen) but is forced to move onscreen quickly
	this.min_x_loc = width - this.width*2; //width of screen - boss width*2 -- he can be 3x his width left of edge of screen
	this.max_x_loc = width - this.width; //width of screen - boss width, he can have his right side line up with edge of screen
  
	//he starts moving towards the player
	//for the boss x_speed > 0 means moving left
	this.x_speed = 50;
	
	//y_speed > 0 means moving downwards
	this.y_speed = 50; //starting y speed, stores y speed
	
	
	this.hairballRate = hairballRate;//how often boss should fire -- this is the max time between firings
	this.hairballCountdown = 50 + Math.floor((Math.random()*this.hairballRate)+1);//set how long to wait until firing, could be twice in a row btw
	
	this.wasJustHitCounter = 0;//if the boss was just hit, used to make boss flash
		
	//called when boss is hit by bullet
	this.decreaseHealth = function(amt)
	{
		if(this.health > 0)
		{
			this.health-=amt;
			
			if(this.health < 0) //if amt was > 1 we may need make this adjustment
				this.health = 0;
				
			this.wasJustHitCounter = 10;
		}
		if(this.health == 0)
		{
		  player.score += this.bonus;
		  player.kills++;
		  player.bossKills++;
		}
	}
	
	//uses the boss's speed to change their current position
	//this is called every frame and does other things that need to happen over time
	this.updatePosition = function()
	{
		//if boss is still getting health bar filled
		if(this.fillingHealth == true)
			this.health+=2.5-2*(this.health/this.maxHealth); //this formula makes the health bar fill slower as it nears the end
			//it starts by filling it by 2.5 hp/frame and ends at .5 hp/frame
		
		if(this.health >= this.maxHealth)//since we fill health by a number != 1 then we may over shoot the max health, this fixes this and stops filling health
		{
			this.fillingHealth = false;
			this.health = this.maxHealth;
		}
			
		//decrement the wasJustHitCounter
		if(this.wasJustHitCounter > 0)
			this.wasJustHitCounter--;
			
		//decrement the hairBallcountdown
		this.hairballCountdown--;
		
		if(this.hairballCountdown == 0 && this.health > 0)//fire a hairball
		{
			hairballs.push(new Hairball(this.x_loc+1*this.width/4, this.y_loc+1*this.height/2, 12, this.y_speed, 0));//create hairball
			//it's fired at 3/4ths down from the top of the boss, to make it seem like hairball came from it's mouth
			//it matches the bosses y_speed
			//it leaves at an x_speed of 12
			//0 means it won't bounce off the top and bottom of the screen //may change this later so I left the option in
			
			this.hairballCountdown = Math.floor((Math.random()*this.hairballRate)+1); //reset hairball countdown
		}
		
		//continue the dying sequence by going into negative health
		if(this.health <= 0)
			this.health--;
			
		//make sure the boss isn't outside of the min/max height before changing position
		//keeps the boss in the 'box' he's supposed to be in
		//if he's outside the box it's allowed to still move if it's moving towards the box (like how it starts out of his 'box' and moves in)
		if(  (this.y_loc > this.max_y_loc && this.y_speed > 0) || (this.y_loc <= this.min_y_loc && this.y_speed < 0))
			this.y_loc -= this.y_speed/10; //remember y_loc increasing means going down!
		else
			this.y_speed = -this.y_speed;//if it's outside of it's box it changes direction
      
		//same as above but for the x_loc and x_speed
		//make sure the enemy isn't outside of the min/max height before changing position
		if(  (this.x_loc >= this.max_x_loc && this.x_speed < 0) || //x_loc is greater than max and it is moving towards min
		     (this.x_loc <= this.min_x_loc && this.x_speed > 0) || //x_loc is less than min and it is going towards max
			 (this.x_loc < this.max_x_loc && this.x_loc > this.min_x_loc))
			this.x_loc += this.x_speed/10; //remember x_loc increasing means going down!
		else
			this.x_speed = -this.x_speed;
	};
	
	//boss's main image
	this.image = new Image();
	this.image.src = "./boss.png";
	
	//small explosion
	this.hit1 = new Image();
	this.hit1.src = "./hit1.png";
	
	//bigger explosion
	this.hit2 = new Image();
	this.hit2.src = "./hit2.png";
	
	//drawing function for the boss
	this.draw = function()
	{
		if(this.wasJustHitCounter % 2 == 0 && this.health > 0)//this lets them flash if they were just hit
			context.drawImage(this.image, this.x_loc, this.y_loc);
		else if(this.health <= 0 && this.health > -5)//just died
			context.drawImage(this.hit1, this.x_loc, this.y_loc, this.width, this.height);//small explosion
		else if(this.health <= -5)//died a second ago
			context.drawImage(this.hit2, this.x_loc, this.y_loc, this.width, this.height);//big explosion
	};
	
};