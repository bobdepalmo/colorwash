/*
 * colorWash.js 1.0.0
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

  colorWash.prototype.init = function(callback) {
    var _ = this;
    if(Array.isArray(_.options.theme)){
      _.build((_.options.invert) ? _.options.theme.reverse() : _.options.theme);
    }else{
      _.loadJSON(_.options.file, function(response) {
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

  colorWash.prototype.gradient = function(type) {
    var _ = this;
    _.type = type;
    switch(_.type) {
      case "radial":
        return ["-webkit-radial-gradient(",  "-moz-radial-gradient(", "-o-radial-gradient(", "radial-gradient("];
      break;
      case "horizontal":
       return ["-webkit-linear-gradient(left,", "-moz-linear-gradient(right,", "-o-linear-gradient(right,", "linear-gradient(right,"];
      break;
      case "vertical":
        return ["-webkit-linear-gradient(", "-moz-linear-gradient(", "-o-linear-gradient(", "linear-gradient("];
      break;
      case "diagonal":
        return ["-webkit-linear-gradient(left top,", "-moz-linear-gradient(bottom right,", "-o-linear-gradient(bottom right,", "linear-gradient(to bottom right,"];
      break;
    }
  }

  colorWash.prototype.build = function(colors) {
    var _ = this;
    _.colors = colors;
    _.n = 0;
    _.colorIndices = [0, 1, 2, 3];
    var el = document.querySelector(_.options.el);
    el.style.opacity = _.options.opacity;
    _.gr = _.gradient(_.options.type);   
    _.gradientSpeed = _.options.steps / 1000;
    _.run(_.colors, _.gr);
    _.timer = setInterval(function(){
      _.run(_.colors, _.gr);
    }, _.options.speed);
  }

  colorWash.prototype.run = function(colors, gr) {
    var _ = this;
    _.colors = colors;
    _.el = document.querySelector(_.options.el);
    _.a = _.colors[_.colorIndices[0]];
    _.b = _.colors[_.colorIndices[1]];
    _.c = _.colors[_.colorIndices[2]];
    _.d = _.colors[_.colorIndices[3]];
    _.e = 1 - _.n;
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

  colorWash.prototype.updateTheme = function(theme) {
    var _ = this;
    _.theme = theme;
    if(Array.isArray(_.theme)){
      _.build((_.options.invert) ? _.theme.reverse() : _.theme);
    }else{
      this.loadJSON(_.options.file, function(response) {
        var key = _.theme;
        var data = JSON.parse(response);
        _.colors = (_.options.invert) ? data[key].reverse() : data[key];
        _.run(_.colors, _.gr);
      });   
    }
  }

  colorWash.prototype.updateGradient = function(type) {
    var _ = this;
    _.type = type;
    _.gr = _.gradient(_.type);
    _.run(_.colors, _.gr);
  }

  colorWash.prototype.stop = function() {
    var _ = this;
    clearInterval(_.timer);
  }

  colorWash.prototype.start = function() {
    var _ = this;
    _.timer = setInterval(function(){
      _.run(_.colors, _.gr);
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