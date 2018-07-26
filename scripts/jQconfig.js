'use strict';
/* global $ */

$.fn.extend({
  serializeJson: function serializeJson() {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => {
      o[name] = val;
    });
    return JSON.stringify(o);
  }
});

function main() {
  
}