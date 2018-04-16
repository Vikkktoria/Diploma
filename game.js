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
      });
    this.width = maxInt;

    this.status = null;

    this.finishDelay = 1;

    // this.player = actors.find(el => el.type === 'player');
    const pl =  actors.find(function(el) {
      return el.type === 'player';
    });
    this.player = pl;


  }

  isFinished() {
    return (this.status !== null)&&(this.finishDelay < 0);
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
    if (!(pos instanceof Vector)||((Vector.isPrototypeOf(pos.prototype)))||(!(size instanceof Vector))||((Vector.isPrototypeOf(size.prototype)))) {
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
    // for (let act of this.actors) {
    //   if (act === actor) {
    //     this.actors.splice(act, 1);
    //   }
    // }

    let ind = this.actors.indexOf(actor);
    if (ind !== -1) {
      this.actors.splice(this.actors[ind], 1);
    }
  }

  noMoreActors(type) {
    for (let actor of this.actors) {
        if (type === actor.type) {
          return false;
      }
    }
    // this.actors.forEach(function(element) {
    //   if (type === element.type) {
    //     return false;
    //   }
    // });
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

// ЗАПУСК ИГРЫ
// const grid = [
//   new Array(3),
//   ['wall', 'wall', 'lava']
// ];
// const level = new Level(grid);
// runLevel(level, DOMDisplay);


class LevelParser  {
  constructor (dictionary) {
    this.dictionary = dictionary;


  }

  actorFromSymbol(symb) {
    if (symb === undefined) {
      return undefined;
    }
    return this.dictionary[symb];
  }

  obstacleFromSymbol (symb) {
      if (symb === 'x') {
        return 'wall';
      } else if (symb === '!') {
        return 'lava';
      } else {
        return undefined;
      }
    }

    createGrid (proGrid) {
      let grid = [];
      for (let i in proGrid) {
        grid[i] = [];
        proGrid[i] = proGrid[i].split('');
        for (let j in proGrid[i]) {
          grid[i].push(this.obstacleFromSymbol(proGrid[i][j]));
        }
      }
      return grid;
    }

    createActors (proGrid) {
      let grid = [];
      for (let i in proGrid) {
        proGrid[i] = proGrid[i].split('');
        for (let j in proGrid[i]) {
          if ((this.dictionary[proGrid[i][j]] !== undefined)&&((this.dictionary[proGrid[i][j]] === Actor)||(this.dictionary[proGrid[i][j]].prototype instanceof Actor))) {
            grid.push(new this.dictionary[proGrid[i][j]](new Vector(j, i)));
          }
        }
      }
      return grid;
    }

    // parse (proGrid) {
    //     let grid = this.createGrid(proGrid);
    //
    //
    //     return grid;
    //   }


}
class Fireball extends Actor {
  constructor (pos = new Vector(0,0), speed = new Vector(0,0)) {
    super (pos);
    this.size = new Vector(1, 1);
    this.speed = speed;
  }
  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
     return new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
   }

  handleObstacle() {
    this.speed = new Vector (this.speed.x * (-1), this.speed.y * (-1) );
  }

  act(time, level) {
    let nextPos = this.getNextPosition(time);
    console.log(nextPos);
    if (level.obstacleAt(nextPos, this.size) === undefined) {
      this.pos = this.getNextPosition(time);
    } else {
      this.handleObstacle();
    }
  }




}

//Горизонтальная шаровая молния
class HorizontalFireball extends Fireball {
  constructor(pos) {
    super(pos);
    this.size = new Vector (1, 1);
    this.speed = new Vector(2, 0);
  }
}

//Вертикальная шаровая молния
class VerticalFireball extends Fireball {
  constructor(pos) {
    super(pos);
    this.size = new Vector (1, 1);
    this.speed = new Vector(0, 2);
  }
}

//Огненный дождь
class FireRain extends Fireball{
  constructor(pos) {
    super(pos);
    this.position = pos;
    this.size = new Vector (1, 1);
    this.speed = new Vector(0, 3);
  }

  handleObstacle() {
    this.pos = this.position ;
  }
}





class Coin extends Actor {
  constructor (pos = new Vector(0,0)) {
    super ();
    this.position = new Vector (pos.x + 0.2, pos.y + 0.1);
    this.pos = new Vector (pos.x + 0.2, pos.y + 0.1);
    this.size = new Vector(0.6, 0.6);
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * 2* Math.PI;

  }
  get type() {
    return 'coin';
  }

  updateSpring(time = 1) {
    this.spring = this.spring + this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    let springVector = this.getSpringVector();
    return new Vector(this.position.x, this.position.y + springVector.y);
  }

  act(time) {
    this.pos = this.getNextPosition(time);
  }



}

class Player extends Actor{
  constructor (pos = new Vector(0,0)) {
    super ();
    this.pos = new Vector (pos.x, pos.y - 0.5);
    this.size = new Vector(0.8, 1.5);

  }

  get type() {
    return 'player';
  }
}



//СЛОВАРЬ
let dictionary = {
  'x' : 'wall',
  '!' : 'lava',
  '@' : Player,
  'o' : Coin,
  '=' : HorizontalFireball,
  '|' : VerticalFireball,
  'v' : FireRain
};
