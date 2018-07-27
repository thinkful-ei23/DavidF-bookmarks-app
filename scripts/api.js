'use strict';
/* global $ */



const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/DavidF';
  
  const getitems = function(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  };
  
  const createItem = function(newItem, callback) {
    const query = {
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: newItem,
      success: callback    
    };
    $.ajax(query);
  };

  const updateItem = function(id, updateData, callback) {
    const query = {
      url : `${BASE_URL}/bookmarks/${id}`,
      method : 'PATCH',
      contentType : 'application/json',
      data : JSON.stringify(updateData),
      success : callback
    };
    $.ajax(query);
  };

  const deleteItem = function(id, callback) {
    const query = {
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      success: callback
    };
    $.ajax(query);
  };

  return {
    getitems,
    createItem,
    updateItem,
    deleteItem
  };
}());

