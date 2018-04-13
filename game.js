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

    // Object.defineProperty (this, 'type', {value: 'actor', enumerable: true });
  }
  get type() {
    return 'actor';
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



//ИГРОВОЕ ПОЛЕ
class Level {
  constructor (grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;


    this.height = grid.length;

    // let gr = Array.of(0);
    // grid.forEach(function(el) {
    //   gr.push(el.length);
    // })
    // this.width = Math.max(...gr);

    let maxInt = 0;
    grid.forEach(function(el) {
        maxInt = Math.max(maxInt, el.length);
      })
    this.width = maxInt;

    this.status = null;

    this.finishDelay = 1;

    // this.player = actors.find(el => el.type === 'player');
    const pl =  actors.find(function(el) {
      return el.type === 'player';
    })
    this.player = pl;


  }

  isFinished() {
    if ((this.status !== null)&&(this.finishDelay < 0)) {
      return true;
    } else {
      return false;
    }
  }

  actorAt (obj) {
    if (!(obj instanceof Actor)||(obj === undefined)) {
      throw new Error('Неверный тип данных');
    }
    // if (this.actors.length = 1) {return undefined;};
    for (let act of this.actors) {
      if (obj.isIntersect(act)) {
        return act;
      }
    }
    return undefined;
  }

  obstacleAt(pos, size) {
    if (!(pos instanceof Vector)||(!(size instanceof Vector))) {
      throw('Неверный тип данных');
    }

    //Пересекается со стеной - выходит за пределы поля
    if((pos.x < 0)||(pos.y < 0)||(pos.x + size.x > this.width)) {
      return 'wall';
    }

    //Пересекается с лавой - выходит за пределы поля внизу
    if (pos.y + size.y > this.width) {
      return 'lava';
    }

    for (let i = Math.floor(pos.y); i < Math.ceil(pos.y + size.y); i++) {
      for (let j = Math.floor(pos.x); j < Math.ceil(pos.x + size.x); j++) {
        if (this.grid[i][j] !== undefined) {
          return this.grid[i][j];
        }
      }
    }

    return undefined;
  }

  removeActor(actor){
    for (let act of this.actors) {
      if (act === actor) {
        this.actors.splice(act, 1);
      }
    }
  }

  noMoreActors(type) {
    for (let actor of this.actors) {
        if (type === actor.type) {
          return false;
      }
    }
    return true;
  }


  playerTouched(type, actor) {
    if (this.status !== null) { return; }
    if ((type === 'lava')||(type === 'fireball')) { this.status = 'lost'; }
    if ((type === 'coin')&&(actor instanceof Actor)&&(actor.type === 'coin')) {
      this.removeActor(actor);
      if (this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }
}


const grid = [
  new Array(3),
  ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);
