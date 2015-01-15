// Generated by CoffeeScript 1.3.3
(function() {
  var Loop, periodicTimeout,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  
  periodicTimeout = function(callback, element, interval) {
    return setTimeout(function() {
      return callback((new Date).getTime() + interval);
    }, interval);
  };
  
  Loop = (function() {
    function Loop(f, interval) {
      this.f = f != null ? f : (function() {});
      this.interval = interval;
      this.stop = __bind(this.stop, this);
      this.start = __bind(this.start, this);
    }
  
    Loop.prototype.start = function() {
      var animLoop, lastCallAt, method;
      if (this.id) {
        return;
      }
      method = this.interval != null ? periodicTimeout : window.requestAnimationFrame;
      lastCallAt = void 0;
      (animLoop = (function(_this) {
        return function() {
          var time;
          time = (new Date).getTime();
          if (_this.f(time, lastCallAt) === false) {
            return _this.stop();
          }
          lastCallAt = time;
          return _this.id = method(animLoop, void 0, _this.interval);
        };
      })(this))();
      return this;
    };
  
    Loop.prototype.stop = function() {
      var method;
      if (this.id == null) {
        return;
      }
      method = this.interval != null ? clearTimeout : cancelAnimationFrame;
      method(this.id);
      this.id = void 0;
      return this;
    };
  
    return Loop;
  
  })();
  
  this.Loop = Loop;
  
  if (typeof module !== "undefined" && module !== null) {
    module.exports = this.Loop;
  }

}).call(this);