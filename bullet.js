//bullet object
  //create it with a position x,y
  //with how quickly it's moving upwards (all bullets move right at same speed)
  //and power 1,2 or 3
function Bullet(x, y, y_speed, power)
{
	this.power = power;
  
	this.height = 4;
	this.width = 8;
  
	this.x_loc = x;
	this.y_loc = y;
		
	//x_speed > 0 means moving right, this speed won't ever change though
	this.x_speed = 15;
	
	//some bullets drift up/down for weapon that fires 2 or 3 bullets
	this.y_speed = y_speed; //starting y speed, stores y speed
		
	//update bullet position
	this.updatePosition = function()
	{
		this.y_loc -= this.y_speed/10; //remember y_loc increasing means going down!
		this.x_loc += this.x_speed; //bullets move right
	};
  
	this.getColor = function()
	{
		switch (this.power)
		{
			case 1:
				return redFill;
				break;                           
			case 2:                              
				return greenFill;
				break;                           
			case 3:                              
				return blueFill;
				break;
		}
	};
		
	//drawing function for the enemy
	this.draw = function()
	{
		drawRect(this.x_loc, this.y_loc, this.width, this.height, this.getColor());
	};
	
};