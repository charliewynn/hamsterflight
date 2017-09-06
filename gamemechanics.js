function keydown(e)
{
	switch (e.keyCode)
	{
		case 38: //up arrow
			upArrowPressed = true;
			break;
		case 13: //enter
			if(!playing)
				playing = true;
			break;
		case 32: //space
			if(!paused)
				firing = true;//we'll wait until redraw before firing, so we're not firing between frames
			break;
		case 80:
			if(playing)//can't pause if you're dead or haven't started
			{
				paused = !paused;
			}
			break;
		case 77:
			myAudio.volume = 1 - myAudio.volume;
			break;
	}
};

function keyup(e)
{
	if(e.keyCode ==  38) //space
		upArrowPressed = false;
};

function didload()
{			
	setMusic(bg);
	canvas = document.getElementById("theCanvas");
	context = canvas.getContext("2d");
	document.onkeydown = keydown;
	document.onkeyup = keyup;
	
	//init game vars
	player = new Player(100);//100 is the player's position  //100 down from top btw
	
	background = new Image();
	background.src = "./background.png";
	
	redraw();
}

function setMusic(music)
{
	if(myAudio != undefined)
		myAudio.pause();
		
	myAudio = new Audio(music); 
	myAudio.addEventListener('ended', function() {
		//if(currentBoss != undefined)
			//this.currentTime = 8;
		this.play();
	}, false);
	myAudio.play();
	myAudio.play();
}

function playerDied()
{
	setMusic(bg);
	//clear enemies
	enemies = [];
	bullets = [];
	hairballs = [];
	currentBoss = undefined;
	
	//notice I don't clear prizes,
		//this was on accident at first but I liked it
		//so if you die, then pick up prizes before they go off screen you get to keep them for the next game
	
	hadGameOver = true; //allows you to see the last game's score on the game startup screen
	lastGameScore = player.score; //these are reset, so we store them
	lastGameKills = player.kills;

	//reset player stats
	player.lives = 3;
	player.score = 0;
	player.kills = 0;
	player.bossKills = 0;
	playing = false;

};

//this is called for every frame to update the location of the objects in the game
function updateGame()
{
	if(paused)//if we're paused we just stop everything from advancing
		return;
	
	if(player.y_loc < player.min_y_loc) //if the player is off the ground
	{	
		if(playing)//if we're playing
			player.score += 5;//increase score if the player is in the air
			
		backgroundScrollNDX = (backgroundScrollNDX + 5) % 1500; //scroll the background
	}
	else
	{
		//can't fire if you're standing on the ground
		firing = false;
	}
	
	//we're throttling how fast you can shoot, this decrements so when it's 0 you can fire again
	if(bulletTimeout > 0)
		bulletTimeout--;


	if(playing)//
	{
		//yes I'm keeping track of the countdown things differently, prizes are random, enemies and boss are based off a formula
		prizeEncounterNDX--;
		enemyEncounterNDX++;
		bossEncounterNDX--;
    
		if(bossEncounterNDX == 0 && currentBoss == undefined)//if it's time for a new boss and there isn't one already
		{
			setMusic(boss);
			var hairballRate = 50 + 2*player.bossKills;
			hairballRate = 150 - hairballRate;
			if(hairballRate < 45)
				hairballRate = 45;
			currentBoss = new Boss(50 + player.bossKills * 25, 2500, hairballRate);
		}
		
		//if we're about to spawn a boss
		//if we didn't just kill a boss
		//if it's time to spawn an enemy
			//enemies span faster if you have an upgraded weapon
				//if you have lots of lives
				//and they spawn faster if your score is highter
		if(bossEncounterNDX > 100 && bossEncounterNDX < (staticBossEncounterNDX - 150) && 
		   enemyEncounterNDX % Math.floor(300/(player.weapon.numBullets + player.weapon.power + player.lives + Math.floor(player.score/500000))) == 0)
		{
			//speed starts at between 2 and 9
			var enemySpeed = 2 + Math.floor((Math.random()*7)+1);
			//make them faster if you've killed more
			enemySpeed += player.kills/35;
			
			//angle starts between -10 and 10
			var enemyAngle = Math.floor((Math.random()*20)-10);
			
			//make them angle more if your kills are higher
			enemyAngle *= player.kills/30;
			
			//after the first 50 kills, every enemy changes dir
			//it's random before that, not likely at first, then increasingly so until you hit 50
			//I think since the angle is still small at this point they could always change dir and it wouldn't really matter but 
			//keeping it this way doesn't hurt anything
			var enemyChangesDir = Math.floor(Math.random()*10-player.kills/5) < 0;
			
			//start enemy at random height but a little but within the screen
			enemies.push(new Enemy(Math.floor((Math.random()*(height - 70))+1), enemySpeed, enemyAngle, enemyChangesDir));
		}
		if(prizeEncounterNDX == 0)
		{
			//create a new prize, random height
			//the type is random too
			prizes.push(new Prize((Math.floor((Math.random()*(height - 70))+1)), (Math.floor((Math.random()*3)+1))));
			
			//reset prize encounter NDX
			prizeEncounterNDX = Math.floor((Math.random()*prizeEncounterRate)+1);
		}
	} //end if playing
	
	//I want to still be able to fire and boost if we're not playing so the rest isn't in the if(playing) statement
	
	
	if(firing && bulletTimeout == 0)
	{
		player.weapon.fire();//fire
		firing = false;//reset firing state //this way you have to keep pressing fire
		bulletTimeout = maxBulletTimeout;//how long until we can fire again
	}
	
	//if there is a boss right now
    if(currentBoss != undefined)
	{
		currentBoss.updatePosition();
    
		if(currentBoss.health < -10)
		{
			setMusic(bg);
			currentBoss = undefined;
			bossEncounterNDX = staticBossEncounterNDX;//reset boss counterNDX
		}
	}
	
	//update each bullet, delete it if it's offscreen
	for (b in bullets)
	{
		bullets[b].updatePosition();
		if(bullets[b].x_loc > width)
		{
			delete bullets[b];
			break;
		}
	}
	
	//update prizes, delete if off screen or dead and collect it if player hits it
	for (p in prizes)
	{
		prizes[p].updatePosition();
		if(prizes[p].health > 0)
		{
			if(areIntersecting(prizes[p], player))
			{
				prizes[p].handleCollision();
				delete prizes[p];
				break;
			}
		}
		if(prizes[p].health <= -10)
		{
			delete prizes[p];
			break;
		}
		
		if(prizes[p].x_loc < -110)
		{
			delete prizes[p];
			break;
		}
	}
	
	//update hairballs
	for (h in hairballs)
	{
		hairballs[h].updatePosition();
		
		//I still keep the hairball around after they're dead so I can display their death sequence, but I don't want to count those as collisions
		if(hairballs[h].health > 0)
		{
			if(areIntersecting(hairballs[h], player) && !player.isInvincible())
			{
				player.handleCollision();
				if(player.lives == 0)
				{
					playerDied();
					return;
				}
			}
		}
		if(hairballs[h].health <= -10)
		{
			delete hairballs[h];
			break;
		}
		
		if(hairballs[h].x_loc < -110)
		{
			delete hairballs[h];
			break;
		}
	}
	
	
	for (e in enemies)
	{
		enemies[e].updatePosition();
		
		//I still keep the enemy around after they're dead so I can display their death sequence, but I don't want to count those as collisions
		if(enemies[e].health > 0)
		{
			if(areIntersecting(enemies[e], player) && !player.isInvincible())
			{
				player.handleCollision();//hit the player
				if(player.lives == 0)//check if player died
				{
					playerDied();
					return;
				}
			}
		}
		if(enemies[e].health <= -10)
		{
			delete enemies[e];
			break;
		}
		
		if(enemies[e].x_loc < -110)// if off screen
		{
			delete enemies[e];
			break;
		}
	}
	
	//check if bullets hit something, enemy, hairball, boss, prize
	//I do the bullet loops separately, since I delete the bullet if they hit something the for each loop indicies get off if I 
	//check if the bullet hit an enemy, hairball, and prize in the same loop
	//it doesn't effect computation this way, in fact it's faster since if a bullet his destroyed by an enemy, we don't check if it hit a prize
	for (b in bullets)
	{	
		for (e in enemies)
		{
			if(areIntersecting(bullets[b], enemies[e]))
			{
				enemies[e].decreaseHealth(bullets[b].power);
				delete bullets[b]; //bullets dissappear if they hit something
				break;
			}
		}
	}
	
	for (b in bullets)
	{	
		for (h in hairballs)
		{
			if(areIntersecting(bullets[b], hairballs[h]))
			{
				hairballs[h].decreaseHealth(bullets[b].power);
				delete bullets[b];
				break;
			}
		}
	}
	for (b in bullets)
	{	
		if(currentBoss != undefined)
		{
			if(areIntersecting(bullets[b], currentBoss))
			{
				currentBoss.decreaseHealth(bullets[b].power);
				delete bullets[b];
				break;
			}
		}
	}
	for (b in bullets)
	{
		for (p in prizes)
		{
			if(areIntersecting(bullets[b], prizes[p]))
			{
				prizes[p].decreaseHealth(bullets[b].power);
				delete bullets[b];
				break;
			}
		}
	}
	
	//handle player speed
	if(upArrowPressed) //make the player rise if pressing space
		player.boost();
	
	player.updatePosition();
};