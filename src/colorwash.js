/*
 * ColorWash.js 1.0.0
 * https://github.com/bobdepalmo/colorwash.js
 * @license MIT licensed
 *
 * Copyright (C) 2016 depalmo.com - A project by Bob DePalmo
 */
(function() {

  this.colorWash = function() {

    var defaults = {
        el: '.colorwash',
        steps: 2,
        speed: 100,
        type: "vertical",
        opacity: 1,
        file: "themes.json",
        theme: "nine",
        invert: false
    }

    this.options = (arguments[0] && typeof arguments[0] === "object") ? extendDefaults(defaults, arguments[0]) : defaults;
  }

  colorWash.prototype.init = function() {
    this.theme();
  }

  colorWash.prototype.theme = function(callback) {
    var _ = this;
    if(Array.isArray(_.options.theme)){
       _.build((_.options.invert) ? _.options.theme.reverse() : _.options.theme);
    }else{
      this.loadJSON(_.options.file, function(response) {
        var key = _.options.theme;
        var data = JSON.parse(response);
        _.colors = (_.options.invert) ? data[key].reverse() : data[key];
        _.build(_.colors);
      });   
    }
  }

  colorWash.prototype.loadJSON = function(file, callback) {
    var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', file, true);
      xobj.onreadystatechange = function() {
      if(xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  colorWash.prototype.build = function(colors) {
    var _ = this;
    _.n = 0;
    _.colorIndices = [0, 1, 2, 3];
    var el = document.querySelector(this.options.el);
    el.style.opacity = this.options.opacity;
    switch(this.options.type) {
      case "radial":
        _.gr = ["-webkit-radial-gradient(",  "-moz-radial-gradient(", "-o-radial-gradient(", "radial-gradient("];
      break;
      case "horizontal":
        _.gr = ["-webkit-linear-gradient(left,", "-moz-linear-gradient(right,", "-o-linear-gradient(right,", "linear-gradient(right,"];
      break;
      case "vertical":
        _.gr = ["-webkit-linear-gradient(", "-moz-linear-gradient(", "-o-linear-gradient(", "linear-gradient("];
      break;
      case "diagonal":
        _.gr = ["-webkit-linear-gradient(left top,", "-moz-linear-gradient(bottom right,", "-o-linear-gradient(bottom right,", "linear-gradient(to bottom right,"];
      break;
    }
      
    _.gradientSpeed = this.options.steps / 1000;
    _.update(colors, _.gr);
    _.timer = setInterval(function(){
      _.update(colors, _.gr);
    }, _.options.speed);
  }

  colorWash.prototype.update = function(colors, gr) {
    var _ = this;
    _.el = document.querySelector(_.options.el);
    _.a = colors[_.colorIndices[0]];
    _.b = colors[_.colorIndices[1]];
    _.c = colors[_.colorIndices[2]];
    _.d = colors[_.colorIndices[3]];
    _.e = 1 - this.n;
      f = Math.round(_.e * _.a[0] + _.n * _.b[0]),
      g = Math.round(_.e * _.a[1] + _.n * _.b[1]),
      h = Math.round(_.e * _.a[2] + _.n * _.b[2]),
      i = "rgb(" + f + "," + g + "," + h + ")",
      j = Math.round(_.e * _.c[0] + _.n * _.d[0]),
      k = Math.round(_.e * _.c[1] + _.n * _.d[1]),
      l = Math.round(_.e * _.c[2] + _.n * _.d[2]),
      m = "rgb(" + j + "," + k + "," + l + ")";
    _.el.style.backgroundImage = ""+gr[0]+""+i+", "+m+")";
    _.el.style.backgroundImage = ""+gr[1]+""+i+", "+m+")";
    _.el.style.backgroundImage = ""+gr[2]+""+i+", "+m+")";
    _.el.style.backgroundImage = ""+gr[3]+""+i+", "+m+")";
    _.n += _.gradientSpeed;

    if (_.n >= 1){
      _.n %= 1;
      _.colorIndices[0] = _.colorIndices[1]; 
      _.colorIndices[2] = _.colorIndices[3];
      _.colorIndices[1] = (_.colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length; 
      _.colorIndices[3] = (_.colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
    }
  }

  colorWash.prototype.stop = function() {
    var _ = this;
    clearInterval(_.timer);
  }

  colorWash.prototype.run = function() {
    var _ = this;
    _.timer = setInterval(function(){
      _.update(_.colors, _.gr);
    }, _.options.speed);
  }

  colorWash.prototype.destroy = function() {
    var _ = this;
    clearInterval(_.timer);
    _.el = document.querySelector(_.options.el);
    _.el.parentNode.removeChild(_.el);
  }

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

}());