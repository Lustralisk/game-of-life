// Created by Shichen Liu on Sep. 23, 2016
// Game of life

var config = {
  row: 60,
  col: 100
};

var i;
var j;
var k;
var moveTick;
var renderMap;
var startView;
var startGame;
var generateRandomMap;

var randomShuffle = function(array) {
//  Knuth Shuffle algorithm
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

startView = function() {
  var randomChoice;
  var chooseChoice;
  var chooseButton;
  var randomButton;
  var randomBack;
  var chooseBack;
  var preload;
  var pushRandom;
  var pushChoice;
  var run;
  pushChoice = function(data, id, chooseChoice) {
    chooseChoice.push(
      $('<div><div class="text">' + data[id].name + '</div></div>')
        .css({
          top: '50%',
          left: 20 + id * 20 + '%',
          display: 'none'
        })
        .addClass('button')
        .appendTo(preload || $('body'))
        .click(function() {
          preload.empty();
          startGame().run(data[id].map);
        }));};
  pushRandom = function(id, randomNames, randomChoice, config) {
    randomChoice.push(
      $('<div><div class="text">' + randomNames[id] + '</div></div>')
        .css({
          top: '50%',
          left: 20 + id * 20 + '%',
          display: 'none'
        })
        .addClass('button')
        .appendTo(preload || $('body'))
        .click(function() {
          preload.empty();
          startGame().run(generateRandomMap(id + 1, config));
        }));};
  run = function() {
    $.getJSON("media/map.json", function(data) {
      preload = $('<div></div>').appendTo($('body'));
      $('<div></div>')
        .css({
          'background-image': 'url(media/logo.png)',
          'background-size': '100% 100%',
          'height': '20%',
          'width': '40%',
          'position': 'absolute',
          'top': '15%',
          'left': '30%'
        })
        .appendTo(preload);
      author = $('<div><div class="text-author"><a target="_blank" href="http://lustralisk.github.io">Lustralisk</a></div></div>')
        .addClass('author')
        .css({
          top: '38%',
          left: '58%'
        })
        .appendTo(preload);
      randomButton = $('<div><div class="text">Random</div></div>')
        .css({
          top: '50%',
          left: '30%'
        })
        .addClass('button')
        .appendTo(preload)
        .click(function() {
          randomButton.fadeOut();
          chooseButton.fadeOut();
          for (i = 0; i < 3; i++)
            randomChoice[i].fadeIn();
          randomBack.fadeIn();
        });
      chooseButton = $('<div><div class="text">Custom</div></div>')
        .css({
          top: '50%',
          left: '50%'
        })
        .addClass('button')
        .appendTo(preload)
        .click(function() {
          randomButton.fadeOut();
          chooseButton.fadeOut();
          for (i = 0; i < 3; i++)
            chooseChoice[i].fadeIn();
          chooseBack.fadeIn();
        });
      chooseChoice = [];
      randomChoice = [];
      var randomNames = ['Sparse', 'Normal', 'Dense'];
      for (i = 0; i < 3; i++) {
        pushRandom(i, randomNames, randomChoice, config);
      }
      randomBack = $('<div class="back"></div>')
        .appendTo(preload)
        .click(function() {
          randomButton.fadeIn();
          chooseButton.fadeIn();
          for (i = 0; i < 3; i++)
            randomChoice[i].fadeOut();
          randomBack.fadeOut();
        });
      for (i = 0; i < 3; i++) {
        pushChoice(data, i, chooseChoice);
      }
      chooseBack = $('<div class="back"></div>')
        .appendTo(preload)
        .click(function() {
          randomButton.fadeIn();
          chooseButton.fadeIn();
          for (i = 0; i < 3; i++)
            chooseChoice[i].fadeOut();
          chooseBack.fadeOut();
        });
    });
  };
  return {
    pushRandom: pushRandom,
    pushChoice: pushChoice,
    run: run
  };
};

startGame = function() {
  var canvas;
  var map;
  var timer;
  var pause;
  var run;
  var cells;
  var initCell;
  var initCells;
  var clickEffect;
  initCell = function(initMapL, i, j, config) {
    // live state
    // 0 <==> dead
    // 1 <==> reborn
    // 2 <==> live
    if (initMapL[i * config.col + j] === 0)
      return 0;
    return 1;
  };
  clickEffect = function() {
    $(this).data('clicked', 1);
  };
  initCells = function(initMapL, mapL, config) {
    var cells = [];
    for (i = 0; i < config.row; i++) {
      cells.push([]);
      for (j = 0; j < config.col; j++) {
        cells[i].push(
          $('<div class="map-cell"></div>')
            .data('live', initCell(initMapL, i, j, config))
            .data('next_live', 0)
            .data('clicked', 0)
            .css({
              left: j * 100 / config.col + '%',
              top: i * 100 / config.row + '%',
              width: 1 * 100 / config.col + '%',
              height: 1 * 100 / config.row + '%'
            })
            .click(clickEffect)
            .appendTo(mapL)
        );
      }
    }
    return cells;
  };
  run = function(initMap) {
    canvas = $('<div></div>').appendTo($('body'));
    map = $('<div class="map"></div>').appendTo(canvas);
    cells = initCells(initMap, map, config);
    timer = setInterval(function() {
      moveTick(cells, config);
    }, 100);
    $('<div class="back"></div>')
      .css('display', 'block')
      .appendTo(canvas)
      .click(function() {
        canvas.empty();
        clearInterval(timer);
        startView().run();
      });
    pause = $('<div class="pause"></div>')
      .appendTo(canvas)
      .click(function() {
        if (timer === -1) {
          timer = setInterval(function() {
            moveTick(cells, config);
          }, 100);
          pause.css('background-image', 'url(media/pause.png)');
        } else {
          clearInterval(timer);
          pause.css('background-image', 'url(media/resume.png)');
          timer = -1;
        }
      });
  };
  return {
    initCells: initCells,
    clickEffect: clickEffect,
    run: run
  };
};

generateRandomMap = function(degree, config) {
  var total = config.row * config.col;
  var init = 200 * Math.pow(2, degree);
  var map = [];
  for (i = 0; i < total; i++) {
    if (i < init)
      map.push(1);
    else
      map.push(0);
  }
  return randomShuffle(map);
};

moveTick = function(cells, config) {
  var deltaX = [1, 1, 0, -1, -1, -1, 0, 1];
  var deltaY = [0, 1, 1, 1, 0, -1, -1, -1];
  var mates;
  var nextLive = function(i, j) {
    if (cells[i][j].data('clicked') === 1) {
      cells[i][j].data('clicked', 0);
      return cells[i][j].data('live') === 0 ? 1 : 2;
    }
    mates = 0;
    for (k = 0; k < 8; k++) {
      if (cells[
        (i + deltaY[k] + config.row) % config.row][
        (j + deltaX[k] + config.col) % config.col].data('live') !== 0) {
        mates++;
      }
    }
    if (mates === 2)
      return cells[i][j].data('live') === 0 ? 0 : 2;
    else if (mates === 3)
      return cells[i][j].data('live') === 0 ? 1 : 2;
    return 0;
  };
  for (i = 0; i < config.row; i++) {
    for (j = 0; j < config.col; j++) {
      cells[i][j].data('next_live', nextLive(i, j));
    }
  }
  for (i = 0; i < config.row; i++) {
    for (j = 0; j < config.col; j++) {
      cells[i][j].data('live', cells[i][j].data('next_live'));
    }
  }
  renderMap(cells, config);
};

renderMap = function(cells, config) {
  var bgColor = function(i, j) {
    if (cells[i][j].data('live') === 2)
      return 'rgba(55,144,234,0.2)';
    else if (cells[i][j].data('live') === 1)
      return 'rgba(55,144,234,1.0)';
    return '#FFFFFF';
  };
  for (i = 0; i < config.row; i++) {
    for (j = 0; j < config.col; j++) {
      cells[i][j].css({
        'background-color': bgColor(i, j)
      });
    }
  }
};

//startView().run();
