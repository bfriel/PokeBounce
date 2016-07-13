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
   { startX: 0, size: 1 },
   { startX: -200, size: 1 },
 ],

 2: [
   { startX: 0, size: 2 },
   { startX: -200, size: 2 }
 ],
};


module.exports = Util;
