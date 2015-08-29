var gameOptions = {
  height: 450,
  width: 700, 
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height)
                .classed({'gameboard': true});

var updateScore = function() {
  d3.select('.current span')
    .text(gameStats.score.toString());
};

var updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select('.high span')
    .text(gameStats.bestScore.toString());
};



// PLAYER CONSTRUCTOR AND METHODS
//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––
var Player = function (gameOptions) {
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.fill = '#ff6600';
  this.x = 0;
  this.y = 0;
  // this.angle = 0;
  this.r = 5;
  this.gameOptions = gameOptions;

};

Player.prototype.renderPlayer = function(board){
  this.el = board.append('svg:path')
            .attr('d', this.path)
            .attr('fill', this.fill);

  this.transform({
    x: this.gameOptions.width * 0.5,
    y: this.gameOptions.height * 0.5
  });

  this.setUpDragging();

  return this;
};

Player.prototype.getX = function(){ return this.x; };
Player.prototype.setX = function(x) {
  minX = this.gameOptions.padding;
  maxX = this.gameOptions.width - this.gameOptions.padding;
  if (x <= minX) {x = minX;}
  if (x >= maxX) {x = maxX;}
  this.x = x;
};

Player.prototype.getY = function(){ return this.y; };
Player.prototype.setY = function(y) {
  minY = this.gameOptions.padding;
  maxY = this.gameOptions.height - this.gameOptions.padding;
  if (y <= minY) {y = minY;}
  if (y >= maxY) {y = maxY;}
  this.y = y;
};

Player.prototype.transform = function(options) {
  // this.angle = options.angle || this.angle;
  this.setX = options.x || this.x;
  this.setY = options.y || this.y;
  // this.el.attr('transform',
  //   "rotate(#{this.angle},#{this.getX()},#{this.getY()}) "+
  //   "translate(#{this.getX()},#{this.getY()})");
  // this.el.attr('transform', ('rotate(' + this.angle + ',' + (this.getX()) + ',' + (this.getY()) + ') ') + ('translate(' + (this.getX()) + ',' + (this.getY()) + ')'));
  this.el.attr('transform', ('translate(' + (this.getX()) + ',' + (this.getY()) + ')'));

};

Player.prototype.moveAbsolute = function(x,y) {
  this.transform({
    x: x,
    y: y
  });
};

Player.prototype.moveRelative = function(dx,dy) {  
  // console.log(this.getX)
  console.log(this)
  var self = this;
  var object = {
    // x: this.x + dx,
    // y: this.y + dy,
    x: self.getX() + dx,
    y: self.getY() + dy,
    angle: 360 * (Math.atan2(dy,dx) / (Math.PI * 2)),
  };

  this.transform(object);
};

Player.prototype.setUpDragging = function() {
  // var moveRelative = this.moveRelative
  // console.log(this)
  var self = this;
  var dragMove = function() {
  // console.log(this)
    self.moveRelative(d3.event.dx, d3.event.dy);
  };

  var drag = d3.behavior.drag()
           .on('drag', dragMove);
  this.el.call(drag);
};

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––



var players = [];
players.push(new Player(gameOptions).renderPlayer(gameBoard));
// players.push(new Player(gameOptions).renderPlayer(gameBoard));

var createEnemies = function() {
  var enemies = [];
  for (var i = 0; i < gameOptions.nEnemies.length; i++) {
    enemies.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }
  return enemies;
};

var enemyData = createEnemies();



var render = function(enemyData) {

  var enemies = gameBoard.selectAll('circle.enemy')
            .data(enemyData, function(d) { return d.id });

  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    // what is axes.x(enemy.x doing???
    .attr('cx', function(enemy) { return axes.x(enemy.x); } )
    .attr('cy', function(enemy) { return axes.y(enemy.y); } )
    // why is radius = 0?
    .attr('r', 10);

  enemies.exit()
    .remove();

  var checkCollision = function(enemy, collidedCallback) {
    for (var i = 0; i < players.length; i++) {
      players[i].radiusSum =  parseFloat(enemy.attr('r')) + player.r;
      players[i].xDiff = parseFloat(enemy.attr('cx')) - player.x;
      players[i].yDiff = parseFloat(enemy.attr('cy')) - player.y;
      players[i].separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
    };
    if (separation < radiusSum) {
      return collidedCallback(player, enemy);
    }
  };

  var onCollision = function() {
    updateBestScore();
    gameStats.score = 0;
    updateScore();
  };


  var tweenWithCollisionDetection = function(endData) {

    var enemy = d3.select(this);

    var startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };

    var endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };

    return function(t) {
      checkCollision(enemy, onCollision);

      enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };

      enemy.attr('cx', enemyNextPos.x)
           .attr('cy', enemyNextPos.y);

    }
  };

  enemies.transition()
            .duration(500)
            .attr('r', 10)
          .transition()
            .duration(2000)
            .tween('custom', tweenWithCollisionDetection);

};

var play = function() {
  var gameTurn = function () {
    var newEnemyPositions = createEnemies();
    render(newEnemyPositions);
  };

  var increaseScore = function () {
    gameStats.score += 1
    updateScore()
  };

  gameTurn();

  setInterval(gameTurn, 2000);
  setInterval(increaseScore, 50);
}

play();











