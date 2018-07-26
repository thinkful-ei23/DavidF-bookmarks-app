'use strict';
/* global $ */

const api = (function() {
  const BASE_URL = '';
  const getitems = function(callback) {
    $.getJSON(`${BASE_URL}/items`, callback);
  };

  return {
    getitems
  };


}());