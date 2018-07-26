'use strict';
/* global $, api */

const bookList = (function(){
  const handleAddBookmark = function(){
    $('#add-entry').submit(e => {
      e.preventDefault();
      console.log(e);
      api.createItem($(e.target).serializeJson(), response => console.log(response));
    });
    
  };
  
  return {
    handleAddBookmark,
  };
})();