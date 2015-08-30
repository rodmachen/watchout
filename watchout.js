var settings = {
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

var drag = d3.behavior.drag()
    .on("drag", dragmove);

function dragmove() {
  var x = d3.event.x + 10;
  var y = d3.event.y - 10;
  d3.select(this).style("transform", "translate(" + x + "px ," + y + "px )");
}

var mouse = d3.select('.gameboard')
                .append('div')
                .classed({'mouse': true})
                .style("transform", "translate(300px, 300px)")
                .call(drag);

setInterval(function() {
  settings.currentScore++;
  d3.select(".current span").text(settings.currentScore);
  d3.select(".high span").text(function() {
    return Math.max(settings.currentScore, settings.bestScore)
  });
}, 100)


var detectCollisions = function(){
  enemies.each(function(){

    // var x = 20px - ;
    // var y = 20px - ;
  })
};

detectCollisions();



