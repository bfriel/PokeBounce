const Util = {

  inherits(ChildClass, ParentClass) {
    const Surrogate = function () {};
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
    ChildClass.prototype.constructor = this;
  },

  distance(pos1, pos2) {
    let dX = pos1[0] - pos2[0];
    let dY = pos1[1] - pos2[1];
    let dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    return dist;
  }

};


Util.LEVELS = {
  1: [
    { startX: 0, size: 2, vel: [2, 2] },
    { startX: -100, size: 1, vel: [2, 2] },
    { startX: -200, size: 2, vel: [2, 2] },
    { startX: -300, size: 1, vel: [2, 2] }
 ],

 2: [
   { startX: -100, size: 3, vel: [2, 2] },
   { startX: 1100, size: 3, vel: [-2, 2] }
 ],

 3: [
   { startX: 0, size: 4, vel: [2, 2] },
   { startX: 1000, size: 3, vel: [-2, 2] },
   { startX: 800, size: 2, vel: [-2, 2] },
   { startX: 200, size: 1, vel: [2, 2] },
 ],

 4: [
   { startX: 0, size: 4, vel: [2, 2] },
   { startX: -200, size: 4, vel: [2, 2] },
   { startX: 800, size: 4, vel: [-2, 2] },
   { startX: 1000, size: 4, vel: [-2, 2] },
 ],

 5: [
   { startX: -400, size: 1, vel: [2, 2] },
   { startX: -500, size: 1, vel: [2, 2] },
   { startX: -600, size: 1, vel: [2, 2] },
   { startX: -700, size: 1, vel: [2, 2] },
   { startX: 1400, size: 1, vel: [-2, 2] },
   { startX: 1500, size: 1, vel: [-2, 2] },
   { startX: 1600, size: 1, vel: [-2, 2] },
   { startX: 1700, size: 1, vel: [-2, 2] },
   { startX: 200, size: 5, vel: [0, 2] },
   { startX: 700, size: 5, vel: [0, 2] },
 ]
};


module.exports = Util;
