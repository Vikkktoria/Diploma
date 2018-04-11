'use strict';

// ВЕКТОР
class Vector  {
  constructor (x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(vector) {
      if (vector instanceof Vector) {
        let newVector = new Vector (this.x, this.y);
        newVector.x += vector.x;
        newVector.y += vector.y;
        return newVector;
      } else {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
  }
  times(multiplier) {
    let newVector = new Vector (this.x, this.y);
    newVector.x = newVector.x * multiplier;
    newVector.y = newVector.y * multiplier;
    return newVector;
  }
}

// ПРОВЕРКА
// const start = new Vector(30, 50);
// const finish = start.times(2);
// const moveToTi = new Vector(5, 10);
// const finish = start.plus(moveToTi.times(2));


// console.log(`Исходное расположение: ${start.x}:${start.y}`);
// console.log(`Исходное расположение: ${moveToTi.x}:${moveToTi.y}`);
// console.log(`Текущее расположение: ${finish.x}:${finish.y}`);



// ДВИЖУЩИЙСЯ ОБЪЕКТ
class Actor  {
  constructor (position, size, speed) {
    if (position === undefined) { position = new Vector(0, 0)}
    if (size === undefined) { size = new Vector(1, 1)}
    if (speed === undefined) { speed = new Vector(0, 0)}
    if (!(position instanceof Vector)||!(size instanceof Vector)||!(speed instanceof Vector)) {
      throw new Error('Данные не типа Vector');
    }
    this.pos = position;
    this.size = size;
    this.speed = speed;

    Object.defineProperty (this, 'type', {value: 'actor', enumerable: true });
  }

  get left() {return this.pos.x;}
  get top() {return this.pos.y;}
  get right() {return this.pos.x + this.size.x;}
  get bottom() {return this.pos.y + this.size.y;}

  act() {}

  isIntersect(obj) {
    if (!(obj instanceof Actor)) {
      throw new Error('Неправильный тип объекта');
    }
    if (obj === this) {
      return false;
    }
    if ((this.left >= obj.right)||(this.right <= obj.left)||(this.top >= obj.bottom)||(this.bottom <= obj.top)) {
      return false;
    } else {return true;}
  }
}

// ПРОВЕРКА
// const items = new Map();
// const player = new Actor();
// items.set('Игрок', player);
// items.set('Первая монета', new Actor(new Vector(10, 10)));
// items.set('Вторая монета', new Actor(new Vector(15, 5)));

// function position(item) {
//   return ['left', 'top', 'right', 'bottom']
//     .map(side => `${side}: ${item[side]}`)
//     .join(', ');
// }

// function movePlayer(x, y) {
//   player.pos = player.pos.plus(new Vector(x, y));
// }

// function status(item, title) {
//   console.log(`${title}: ${position(item)}`);
//   if (player.isIntersect(item)) {
//     console.log(`Игрок подобрал ${title}`);
//   }
// }

// items.forEach(status);
// movePlayer(10, 10);
// items.forEach(status);
// movePlayer(5, -5);
// items.forEach(status);





//ИГРОВОЕ ПОЛЕ
class Level {
  constructor (grid = new Array(0), actors) {
    this.grid = grid;
    // if (grid === undefined) {
    //   this.grid = new Array(0);
    // }
    this.actors = actors;
    this.player = {
      type : player
    };

    this.height = grid.length;

    let maxInd = grid[0].length;
    for (let gr of grid) {
      if (gr.length > maxInd) {maxInd = gr.length;}}
    this.width = maxInd;

    this.status = null;

    this.finishDelay;


  }

  isFinished() {
    if ((this.status !== null)&&(this.finishDelay < 0)) {
      return true;
    }
  }

  actorAt (obj) {
    if (!(obj instanceof Actor)||(obj === undefined)) {
      throw('Неверный тип данных');
    }
    for (let act of this.actors) {
      if ((act.left <= obj.right)&&(act.right >= obj.left)&&(act.top <= obj.bottom)&&(act.bottom >= obj.top)) {
        return act;
      }
    }
    return undefined;
  }

  obstacleAt(pos, size) {
    if (!(pos instanceof Vector)||(!(size instanceof Vector))) {
      throw('Неверный тип данных');
    }

    if((pos.x < 0)||(pos.y < 0)||(pos.x + size.x > this.width)) {
      return 'wall';
    }

    if (pos.y + size.y > this.width) {
      return 'lava';
    }

    let obstacle = '';
    for (let i = pos.y; i <= (pos.y + size.y); i++) {
      for (let j = pos.x; j <= (pos.x + size.x); j++) {
        if (this.grid[i][j] !== undefined) {
          obstacle = obstacle + ', ' + this.grid[i][j];
        }
      }
    }
    if (obstacle === '') {
      return undefined;
    } else {
      return obstacle;
    }
  }

  removeActor(actor){
    if(actor !== undefined) {
      actor = null;
    }
  }

  noMoreActors(type){
    for (let i of this.grid) {
      for (let j of i) {
        if(type === j.type) {
          return false;
        }
      }
    }
    return true;
  }

  // noMoreActors(type){
    // for (let i = 0; i<= this.height; i++) {
    //   for (let j = 0; j<= this.width; j++) {
    //     if(type === grid[i][j]) {
    //       return false;
    //     }
    //   }
    // }
  //   return true;
  // }


  playerTouched(type, actor) {
    if ((type === 'lava')||(type === 'fireball')) {
      this.status = 'lost';
    }
    if ((type === 'coin')&&(actor.type === 'coin')) {
      actor = null;
      if (this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }

}






//ПРИМЕР
const grid = [
  [undefined, undefined],
  ['wall', 'wall']
];

function MyCoin(title) {
  this.type = 'coin';
  this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);

level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
  console.log('Все монеты собраны');
  console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
  console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
  console.log('Пользователь столкнулся с шаровой молнией');
}

// Все монеты собраны
// Статус игры: won
// На пути препятствие: wall
// Пользователь столкнулся с шаровой молнией







// const grid = [
//   new Array(3),
//   ['wall', 'wall', 'lava']
// ];
// const level = new Level(grid);
// runLevel(level, DOMDisplay);
