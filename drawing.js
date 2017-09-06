//Colors
var redFill = "rgba(255,0,0,1)";
var greenFill = "rgba(34,139,34,1)";
var blueFill = "rgba(0,0,255,1)";
var blackFill = "rgba(0,0,0,1)";
var whiteFill = "rgba(255,255,255,1)";

//draws text to screen, font is optional
function drawText(x, y, text, color, font)
{
	context.fillStyle = color;
	context.font = typeof font == 'undefined' ? 'italic bold 15px sans-serif' : font;
	context.textBaseline = 'bottom';
	context.fillText(text, x, y);
};
function strokeText(x, y, text, color, font)
{
	context.strokeStyle = color;
	context.font = typeof font == 'undefined' ? 'bold 15px sans-serif' : font;
	context.lineWidth = 9;
	context.textBaseline = 'bottom';

	context.fillStyle = whiteFill;
	context.lineWidth = 3;
	context.fillText(text, x, y);
	
	context.strokeText(text, x, y);
	
};

function redraw()
{
	//the background is just two images that sit side by side and move left, when the first image is all of the way off screen they both move right by one
	//image width to make a seamless scrolling background
	//gamemechanics.js controls the backgroundScrollNDX
	context.drawImage(background, -backgroundScrollNDX, 0); //draw the first background
	context.drawImage(background, 1500-backgroundScrollNDX, 0); //draw the second background
	
	//if not playing, display howto, and last game details
	if(!playing)
	{
		drawText(160, 80, "Hamster Flight", blackFill, 'italic bold 25px sans-serif');
		drawText(600, 80, "Developed By Charlie Wynn", blackFill, 'italic bold 25px sans-serif');
		drawText(600, 110, "Artwork By Brittany Rollins", blackFill, 'italic bold 25px sans-serif');
		drawText(600, 140, "Music By Cody Codbarley", blackFill, 'italic bold 25px sans-serif');
		
		if(hadGameOver)//only won't be true on first playing the game
		{
			drawText(350, 180, "Game Over:", blackFill);
			drawText(350, 200, "Kills: " + lastGameKills, blackFill, 'italic 15px sans-serif');
			drawText(350, 220, "Score: " + lastGameScore, blackFill, 'italic 15px sans-serif');
		}
		
		drawText(550, 280, "How to Play:", blackFill);
		drawText(550, 300, "Press Up Arrow to use jetpack", blackFill, 'italic 15px sans-serif');
		drawText(550, 320, "Press Space to shoot", blackFill, 'italic 15px sans-serif');
		drawText(550, 340, "    You can't shoot while you're on the ground!", blackFill, 'italic 15px sans-serif');
		
		drawText(550, 360, "Collect Prizes to improve weapons", blackFill, 'italic 15px sans-serif');
		drawText(550, 380, "    Shoot up to three bullets at a time!", blackFill, 'italic 15px sans-serif');
		drawText(550, 400, "    Increase the power of your shot up to 3x!", blackFill, 'italic 15px sans-serif');
		drawText(550, 420, "If you get hurt you lose a life and your weapons downgrade", blackFill, 'italic 15px sans-serif');
		drawText(550, 450, "Press Enter to begin playing!", blackFill, 'italic bold 19px sans-serif');
	}
	else
	{			
		//print current lives/score/kills
		drawText( 135, 490, "Lives: " + player.lives + "/" + player.maxLives, blackFill);//num lives   eg 3/5
		drawText( 220, 490, "Kills: " + player.kills, blackFill);//num kills
		drawText( 300, 490, "Score: " + player.score, blackFill);//current score
		drawText( 810, 490, "'m' to Mute", blackFill);
		drawText( 900, 490, "'p' to Pause", blackFill);
    
		//display the current weapon type
		drawText( 20, 490, "Weapon: ", blackFill);
		for(var i=0; i<player.weapon.numBullets; ++i)
		{
			//display dots of the current bullet color 15 px apart
			drawCircle( 90 + 15*i, 482, 5, player.weapon.bulletColor);
		}
		
		//draw boss health
		if(currentBoss != undefined)
		{
			//black outline
			drawBox( 450, 477, 300, 10, blackFill);
			
			var bossHealth = currentBoss.health;
			if(bossHealth < 0)//because boss health goes to -10 when it's dead, we need to not make the red rectangle go out of the box backwards
				bossHealth = 0;
			drawRect( 451, 478, 300*(bossHealth/currentBoss.maxHealth), 8, redFill);//drar red health incicator
		}
	}
	
	//draw elements
	for (e in enemies)
		enemies[e].draw();
	for (b in bullets)
		bullets[b].draw();				
	for (p in prizes)
		prizes[p].draw();
    
	if(currentBoss != undefined)
		currentBoss.draw();
		
	for(h in hairballs)
		hairballs[h].draw();
		
	player.draw();
	
	if(paused && playing)
	{
		strokeText(350, 230, "Paused", blackFill, '95px sans-serif');
		//strokeText(350, 230, "Paused", whiteFill, 'italic bold 95px sans-serif');
	}
	
	//I'm not sure if canvas has a drawing function you can set like in openGL
	//but calling this at the end of the function keeps the stack from building so it's low overhead and works for updating the game
	//and we can force the frame rate this way
	//redraw the canvas and update game
	setTimeout( function(){	updateGame(); redraw(); }, 25);
};

//generic draw rectangle function
function drawRect(x1,y1,x2,y2,color)
{
	context.beginPath();
	context.fillStyle = color;
	context.fillRect(x1,y1,x2,y2);
	context.closePath();
	context.fill();
};

//only used for boss health outline
function drawBox(x1,y1,x2,y2,color)
{
	context.beginPath();
	context.fillStyle = color;
	context.strokeRect(x1,y1,x2,y2);
	context.closePath();
	context.fill();
};

//only used for drawing the weapon type
function drawCircle(x,y,radius,color)
{
	context.beginPath();
	context.fillStyle = color;
	context.arc(x, y, radius, 0, Math.PI*2,false);
	context.closePath();	
	context.fill();
};