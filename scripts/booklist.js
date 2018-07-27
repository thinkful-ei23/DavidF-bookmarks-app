'use strict';
/* global $, api, store */

const bookList = (function(){
  
  function generateItemElement(item) {
    if (item.expanded) {
      return `
      <li class="js-bookmark-item container" data-item-id="${item.id}">
          <span class="list-name">${item.title} </span>
          <span class="list-rating">${item.rating} Stars</span>>
          <form class="js-edit-item-desc">
            <input class="bookmark-item" type="text" value="${item.desc}">
          </form>
          <a href="${item.url}" class="button">Visit Page</a>
          <button type="submit" class="list-delete">Remove</button>
      </li>`;
    } else {
      return `
    <li class="js-bookmark-item container" data-item-id="${item.id}">
      <span name="${item.title}" class="condensed-name">${item.title} </span>
      <span name="${item.rating}" class="condensed-rating">${item.rating} Stars</span>
    </li>
    `;}
  }

  function generateBookmarkItemsString(bookmarkList) {
    const items = bookmarkList.map((item) => generateItemElement(item));
    return items.join('');
  }

  function generateEditBox(){
    return `
      <form id="js-add-entry" class="container">
      <input type="text" name="title" class="name-entry" placeholder="Enter Bookmark Name Here">
      <select name="rating">
        <option value="1">1 Star</option>
        <option value="2">2 Star</option>
        <option value="3">3 Star</option>
        <option value="4">4 Star</option>
        <option value="5">5 Star</option>
      </select>
      <input type="text" name="url" class="url-entry" placeholder="Enter URL Here">
      <input type="text" name="desc" class="desc-entry" placeholder="Enter description here">
      <p class="Error-message">Error</p>
      <button type="submit">Submit</button>
    </form>
    `;
  }
      
  function render() {
    // Filter item list if store prop is true by item.checked === false
    if (store.editMode){
      const html = generateEditBox();
      $('.placeholder').html(html);
    } else {
      $('.placeholder').html('');
    }
    
    let items = store.items;  
    items = store.items.filter(item => item.rating > store.minVal);
    console.log('`render` ran');
    const bookListItemsString = generateBookmarkItemsString(items);
    console.log(items);
    $('.bookmark-list').html(bookListItemsString);
  }
    
  const handleEditMode = function(){
    $('.editMode').on('click', function(e) {
      e.preventDefault();
      store.editMode = !store.editMode;
      render();
    });

  };

  const handleMinSelect = function () {

  };

  const handleAddBookmark = function(){
    console.log('I was called');
    $('.placeholder').on('submit','#js-add-entry', event => {
      console.log('I ran');
      event.preventDefault();
      const newItem = $(event.target).serializeJson();
      api.createItem(newItem, function(storeNew){
        store.addItem(storeNew);
        render();
      });
    });
    
  };
  
  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-bookmark-item')
      .data('item-id');
  }


  const handleExpand = function(){
    $('.bookmark-list').on('click', 'li', event => {
      const id = getItemIdFromElement(event.currentTarget);
      const expandedObj = store.findById(id);
      console.log(expandedObj);
      if (expandedObj.hasOwnProperty('expanded')) {
        expandedObj.expanded = !expandedObj.expanded;
      }
      render();
    }
    );
  };

  function bindEventListeners() {
    handleExpand();
    handleAddBookmark();
    handleEditMode();
    getItemIdFromElement();
    handleMinSelect();
  }

  return {
    render,
    bindEventListeners
  };
})();