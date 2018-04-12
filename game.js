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



//ИГРОВОЕ ПОЛЕ
class Level {
  constructor (grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;


    this.height = grid.length;

    let maxInd = 0;
    // for (let gr of grid) {
    //   if (gr.length > maxInd) {maxInd = gr.length;}}
    // this.width = maxInd;

    this.status = null;

    this.finishDelay = 1;

    // this.player = actors.find(el => el.type === 'player');
    const pl =  actors.find(function(el) {
      return el.type === 'player';
    })
    this.player = pl;
    // this.player.type = 'player';
    // {
    //   type : 'player'
    // };

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
    // if (!(pos instanceof Vector)||(!(size instanceof Vector))) {
    //   throw('Неверный тип данных');
    // }
    //
    // if((pos.x < 0)||(pos.y < 0)||(pos.x + size.x > this.width)) {
    //   return 'wall';
    // }
    //
    // if (pos.y + size.y > this.width) {
    //   return 'lava';
    // }
    //
    // let obstacle = '';
    // for (let i = pos.y; i <= (pos.y + size.y); i++) {
    //   for (let j = pos.x; j <= (pos.x + size.x); j++) {
    //     if (this.grid[i][j] !== undefined) {
    //       obstacle = obstacle + ', ' + this.grid[i][j];
    //     }
    //   }
    // }
    // if (obstacle === '') {
    //   return undefined;
    // } else {
    //   return obstacle;
    // }
    //
    // return undefined;
  }

  removeActor(actor){
    // if(actor !== undefined) {
    //   actor = null;
    // }
  }

  noMoreActors(type){
    for (let actor of this.actors) {
        if(type === actor.type.valu) {
          return false;
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
