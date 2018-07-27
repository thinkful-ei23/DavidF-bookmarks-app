'use strict';

const store = (function(){

  const addItem = function(item) {
    item.expanded = false;
    this.items.push(item);
  };

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  const findAndUpdate = function(id, newData) {
    const item = this.findById(id);
    Object.assign(item, newData);
  };

  const expand = {
    expanded : false
  };

  const minVal = 0;

  const editMode = true;

  return {
    items: [],
    minVal,
    editMode,
    expand,
    addItem,
    findById,
    findAndUpdate,
  };
  

}());