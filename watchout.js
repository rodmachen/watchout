var settings = {
  // width: settings.radius * 2,
  // height: settings.radius * 2,
  radius: 5,
  currentScore: 0,
  bestScore: 0,
  nEnemies: 30,
};

var pixel = function(num) { return num + "px"};
var randomX = function() { return pixel(Math.floor(Math.random() * 760)); };
var randomY = function() { return pixel(Math.floor(Math.random() * 600)); };


var enemies = d3.select('.gameboard')
                .selectAll('div')
                .data(d3.range(0, settings.nEnemies))
                .enter()
                .append('div')
                .classed({'enemy': true})
                .style({top: randomY, left: randomX});

var moveEnemies = function(element) {
  element.transition()
         .duration(2000)
         .style({top: randomY, left: randomX})
         .each('end', function() {
          moveEnemies(d3.select(this));});
};

moveEnemies(enemies);

// var board = d3.select('.gameboard');
// board.on()

var drag = d3.behavior.drag()
    .on("drag", dragmove);

function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
}

var mouse = d3.select('.gameboard')
                .append('div')
                .classed({'mouse': true})
                .style({top: '300px', left: '300px'})
                .call(drag);
                // .style({top: randomY, left: randomX});

