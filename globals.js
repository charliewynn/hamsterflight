var canvas;
var context;
var width = 995;//size of the canvas
var height = 495;

var player;

var upArrowPressed = false;
var playing = false;
var paused = false;
var firing = false;
var enemyEncounterNDX = 75;//how often to encounter enemies

var staticBossEncounterNDX = 1500;//how often to fight boss
var bossEncounterNDX = staticBossEncounterNDX;//decrements, when it gets to 0 a boss appears

var prizeEncounterRate = 200; //max time to wait for a prize
var prizeEncounterNDX = Math.floor((Math.random()*prizeEncounterRate)+1);//randomly set how long to wait for a prize

var bulletTimeout = 0;//this counts down to when we can fire again //you start off being able to fire so start with this = 0
var maxBulletTimeout = 10;//how long to limit how often we can fire
		
var hadGameOver = false;//don't show last game stats at beginning of first game
var lastGameScore = 0;
var lastGameKills = 0;
	
var myAudio = undefined;
var bg = "./music/bg.mp3";
var boss = "./music/boss.mp3";	

var background;//stores the image used for the background
var backgroundScrollNDX = 0;//how far the background should be scrolled (more in drawing.js under redraw()    )

var enemies = [];//current enemies alive in the game, or dying
var bullets = [];//current bullets flying
var hairballs = [];//hairballs the boss has sent to us
var prizes = [];//prizes that are in the game currently
var currentBoss;