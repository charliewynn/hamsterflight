//weapon object
//player has one weapon object for entire game
function Weapon()
{
	this.power = 1;
	this.numBullets = 1;

	this.fire = function()
	{
		if(this.numBullets == 1 || this.numBullets == 3)
			bullets.push(new Bullet(player.x_loc + player.width, player.y_loc, 0, this.power));//one bullet in center
		if(this.numBullets == 2 || this.numBullets == 3)
		{
			bullets.push(new Bullet(player.x_loc + player.width, player.y_loc, 8, this.power));//two bullets spreading apart from center
			bullets.push(new Bullet(player.x_loc + player.width, player.y_loc, -8, this.power));
		}
	};
	
	this.increaseNumOfBullets = function()
	{
		if(this.numBullets < 3)
			this.numBullets++;
	};
	
	this.increasePower = function()
	{
		if(this.power < 3)
			this.power++;
			
		if(this.bulletColor == redFill)
			this.bulletColor = greenFill;
		else if(this.bulletColor == greenFill)
			this.bulletColor = blueFill;
	};
	
	this.decreaseNumOfBullets = function()
	{
		if(this.numBullets > 1)
			this.numBullets--;
	};
	
	this.decreasePower = function()
	{
		if(this.power > 1)
			this.power--;
			
		if(this.bulletColor == blueFill)
			this.bulletColor = greenFill;
		else if(this.bulletColor == greenFill)
			this.bulletColor = redFill;
	};
  
	this.bulletColor = redFill;
  
	this.image = new Image();//the little 'hat' on top of player (could have been in original image, but this is fine too)
	this.image.src = "./weapon.png";
	
	//drawing function for the enemy
	this.draw = function()
	{
		context.drawImage(this.image, player.x_loc + player.width/2 + 22, player.y_loc - player.height/2 + 30);//the numbers here help place it correctly on the player
	}
};