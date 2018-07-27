'use strict';
/* global bookList, $, store, api */

$(document).ready(function() {
  bookList.bindEventListeners();
  api.getitems(items => {
    items.forEach((item) => store.addItem(item));
    bookList.render();
  });
});