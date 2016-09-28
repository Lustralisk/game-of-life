describe('get random mode\'s options', function() {
  var pushRandom = startView().pushRandom;
  it('should be a function', function() {
    assert.isFunction(pushRandom);
  });
  it('should have four arguments', function() {
    assert.equal(pushRandom.length, 4);
  });
  context('append an option', function() {
    var names = [];
    var choices = [];
    var config = {};
    choices = [];
    beforeEach(function() {
      names = ['a', 'b'];
      choices = [];
      config = {
        row: 10,
        col: 10
      };
    });
    it('should append one element once', function() {
      pushRandom(1, names, choices, config);
      assert.equal(choices.length, 1);
    });
    it('should append correct element', function() {
      pushRandom(0, names, choices);
      assert.equal(choices[0].hasClass('button'), true);
    });
  });
});

describe('get custom mode\'s options', function() {
  var pushChoice = startView().pushChoice;
  it('should be a function', function() {
    assert.isFunction(pushChoice);
  });
  it('should have three arguments', function() {
    assert.equal(pushChoice.length, 3);
  });
  context('append an option', function() {
    var names = [];
    var choices = [];
    choices = [];
    beforeEach(function() {
      names = ['a', 'b'];
      choices = [];
    });
    it('should append one element once', function() {
      pushChoice(names, 1, choices);
      assert.equal(choices.length, 1);
    });
    it('should append correct element', function() {
      pushChoice(names, 0, choices);
      assert.equal(choices[0].hasClass('button'), true);
    });
  });
});

describe('initialize cells in the map', function() {
  var initCells = startGame().initCells;
  it('should be a function', function() {
    assert.isFunction(initCells);
  });
  it('should have three arguments', function() {
    assert.equal(initCells.length, 3);
  });
  context('size', function() {
    var init = [];
    var config = {};
    beforeEach(function() {
      config = {
        col: 10,
        row: 10
      };
      for (i = 0; i < config.row * config.col; i++) {
        init.push(Math.random() > 0.5 ? 0 : 1);
      }
      cells = initCells(init, $('<div></div>'), config);
    });
    it('should return array has same row as config', function() {
      assert.equal(cells.length, config.row);
    });
    it('should return array has same col as config', function() {
      assert.equal(cells[0].length, config.col);
    });
  });
  context('correctness', function() {
    var init = [];
    var config = {};
    beforeEach(function() {
      config = {
        col: 10,
        row: 10
      };
      for (i = 0; i < config.row * config.col; i++) {
        init.push(Math.random() > 0.5 ? 0 : 1);
      }
      cells = initCells(init, $('<div></div>'), config);
    });
    it('should corresponding as the init map', function() {
      for (i = 0; i < config.row; i++) {
        for (j = 0; j < config.col; j++) {
          assert.equal(cells[i][j].data('live'), init[i * config.col + j]);
        }
      }
    });
  });
});

describe('clicking adding attribute', function() {
  var click = startGame().clickEffect;
  it('should be a function', function() {
    assert.isFunction(click);
  });
  context('correctness', function() {
    var node;
    beforeEach(function() {
      node = $('<any></any>');
      node.click = click;
      node.click();
    });
    it('should attribute correct attr', function() {
      assert.equal(node.data('clicked'), 1);
    });
  });
});

describe('random map generator', function() {
  var config = {
    row: 50,
    col: 50
  }
  it('should be a function', function() {
    assert.isFunction(generateRandomMap);
  });
  context('randomness', function() {
    it('should be random(it\'s normal to be a little bit slowly)', function() {
      map1 = generateRandomMap(1, config);
      map2 = generateRandomMap(1, config);
      assert.notDeepEqual(map1, map2);
    });
  });
  context('size', function() {
    it('should as same size as config', function() {
      map = generateRandomMap(1, config);
      assert.equal(map.length, config.row * config.col);
    });
  });
  context('degree', function() {
    it('should as same degree as config', function() {
      map = generateRandomMap(1, config);
      var total = 0;
      for (i = 0; i < map.length; i++) {
        if (map[i] === 1) {
          total++;
        }
      }
      assert.equal(total, 200 * Math.pow(2, 1));
    });
  });
});

describe('tick engine', function() {
  it('should be a function', function() {
    assert.isFunction(moveTick);
  });
  it('should have two argument', function() {
    assert.equal(moveTick.length, 2);
  });
  context('movement', function() {
    var config;
    var cells = [];
    beforeEach(function() {
      config = {
        col: 3,
        row: 3
      };
      cells = [];
      for (var i = 0; i < 3; i++) {
        cells.push([]);
        for (var j = 0; j < 3; j++) {
          cells[i].push($('<div></div>')
                     .data('clicked', 0)
                     .data('live', 0)
                     .data('next_live', 0));
        }
      }
    });
    it('should die when less than two cells around', function() {
      cells[0][0].data('live', 1);
      cells[1][1].data('live', 1);
      moveTick(cells, config);
      assert.equal(cells[1][1].data('live'), 0);
    });
    it('should keep dead when two cells around', function() {
      cells[0][0].data('live', 1);
      cells[0][1].data('live', 1);
      cells[1][1].data('live', 0);
      moveTick(cells, config);
      assert.equal(cells[1][1].data('live'), 0);
    });
    it('should keep live when two cells around', function() {
      cells[0][0].data('live', 1);
      cells[0][1].data('live', 1);
      cells[1][1].data('live', 1);
      moveTick(cells, config);
      assert.equal(cells[1][1].data('live'), 2);
    });
    it('should alive when three cells around', function() {
      cells[0][0].data('live', 1);
      cells[0][1].data('live', 1);
      cells[0][2].data('live', 1);
      cells[1][1].data('live', 0);
      moveTick(cells, config);
      assert.equal(cells[1][1].data('live'), 1);
    });
    it('should die when more than three cells around', function() {
      cells[0][0].data('live', 1);
      cells[0][1].data('live', 1);
      cells[0][2].data('live', 1);
      cells[2][2].data('live', 1);  
      cells[1][1].data('live', 1);
      moveTick(cells, config);
      assert.equal(cells[1][1].data('live'), 0);
    });
    it('should concate up and bottom bound', function() {
      cells[0][0].data('live', 1);
      cells[0][1].data('live', 1);
      cells[0][2].data('live', 1);
      cells[2][1].data('live', 0);
      moveTick(cells, config);
      assert.equal(cells[2][1].data('live'), 1);
    });
    it('should concate left and right bound', function() {
      cells[0][0].data('live', 1);
      cells[1][0].data('live', 1);
      cells[2][0].data('live', 1);
      cells[1][2].data('live', 0);
      moveTick(cells, config);
      assert.equal(cells[1][2].data('live'), 1);
    });
  })
});
