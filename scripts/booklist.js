'use strict';
/* global $, api, store */

const bookList = (function() {
  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }

    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateItemElement(item) {
    if (item.expanded) {
      return `
      <li class="js-bookmark-item__expanded container" data-item-id="${
  item.id
  }">
        <div class="name-rate">
          <span class="list-name col-6">${item.title}</span>
          <span class="list-rating rating col-6">${item.rating} Stars</span>
        </div>
        <div class="expandedlist">
          <form id="js-edit-item-desc" class="desc-rate-update">
            <textarea class="bookmark-desc" type="text" aria-label="Editable description" name="desc" cols="40" rows="3" required>${
  item.desc
  }</textarea>
            <select name="rating" aria-label="select to change rating">
              <option value="1">1 Star</option>
              <option value="2">2 Star</option>
              <option value="3">3 Star</option>
              <option value="4">4 Star</option>
              <option value="5">5 Star</option>
            </select>
            <button type="submit" class="update-data">Update</button>
          </form>
          <section class="visit-remove-collapse">
            <a href="${item.url}" class="button">Visit Page</a>
            <button type="submit" class="list-delete">Remove</button>
            <button class="list-collapse">Collapse</button>
          </section>
        </div>
      </li>`;
    } else {
      return `
    <li class="js-bookmark-item container" data-item-id="${item.id}">
      <div class="name-rate">
        <span name="${item.title}" class="list-name">${
    item.title
  } (click to expand) </span>
        <span name="${item.rating}" class="list-rating rating">${
    item.rating
  } Stars</span>
      </div>
    </li>
    `;
    }
  }

  function generateBookmarkItemsString(bookmarkList) {
    const items = bookmarkList.map(item => generateItemElement(item));
    return items.join('');
  }

  function generateEditBox() {
    return `
      <form id="js-add-entry" class="container add-form" role="form">
        <input type="text" required aria-label="Enter Bookmark Name" name="title" class="name-entry" placeholder="Enter Bookmark Name Here">
        <select name="rating" aria-label="Select Rating Dropdown">
          <option value="1">1 Star</option>
          <option value="2">2 Star</option>
          <option value="3">3 Star</option>
          <option value="4">4 Star</option>
          <option value="5">5 Star</option>
        </select>
        <input type="text" required aria-label="Enter URL" name="url" class="url-entry" placeholder="Enter URL Here">
        <textarea class="desc-entry" type="text" aria-label="Enter description" name="desc" cols="40" rows="3" required placeholder="Enter Description"></textarea>
        <div class="error-container"></div>
        <button type="submit">Submit</button>
      </form>
    `;
  }

  function render() {
    // Filter item list if store prop is true by item.checked === false
    if (store.editMode) {
      const html = generateEditBox();
      $('.placeholder').html(html);
      if (store.error) {
        const el = generateError(store.error);
        $('.error-container').html(el);
      } else {
        $('.error-container').empty();
      }
    } else {
      $('.placeholder').empty();
    }
    let items = store.items;
    items = store.items.filter(item => item.rating >= store.minVal);
    const bookListItemsString = generateBookmarkItemsString(items);
    $('.bookmark-list').html(bookListItemsString);
  }

  const handleEditMode = function() {
    $('.editMode').on('click', function(e) {
      e.preventDefault();
      store.editMode = !store.editMode;
      render();
    });
  };

  const handleMinSelect = function() {
    $('.min-set').on('change', event => {
      const newMin = parseInt($('.min-set').val());
      store.minVal = newMin;
      render();
    });
  };

  const handleAddBookmark = function() {
    $('.placeholder').on('submit', '#js-add-entry', event => {
      event.preventDefault();
      const newItem = $(event.target).serializeJson();
      {
        api.createItem(
          newItem,
          function(storeNew) {
            store.addItem(storeNew);
            render();
          },
          err => {
            console.log(err);
            store.setError(err);
            render();
          }
        );
      }
    });
  };

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-bookmark-item')
      .data('item-id');
  }

  function getItemIdFromExpandedElement(item) {
    return $(item)
      .closest('.js-bookmark-item__expanded')
      .data('item-id');
  }

  const handleExpand = function() {
    $('.bookmark-list').on('click', '.js-bookmark-item', event => {
      const id = getItemIdFromElement(event.currentTarget);
      const expandedObj = store.findById(id);
      expandedObj.expanded = true;
      render();
    });
  };

  const handleCollapse = function() {
    $('.bookmark-list').on('click', '.list-collapse', event => {
      const id = getItemIdFromExpandedElement(event.currentTarget);
      const collapsedObj = store.findById(id);
      collapsedObj.expanded = false;
      render();
    });
  };

  const handleDelete = function() {
    $('.bookmark-list').on('click', '.list-delete', event => {
      const id = getItemIdFromExpandedElement(event.currentTarget);
      api.deleteItem(id, function() {
        api.getitems(function(items) {
          store.items = items;
          render();
        });
      });
    });
  };

  const handleEdit = function() {
    $('.bookmark-list').on('submit', '#js-edit-item-desc', event => {
      event.preventDefault();
      const id = getItemIdFromExpandedElement(event.target);
      const newData = $(event.currentTarget).serializeJson();
      api.updateItem(id, newData, function() {
        api.getitems(function(items) {
          store.items = items;
          render();
        });
      });
    });
  };

  function handleCloseError() {
    $('.placeholder').on('click', '#cancel-error', () => {
      store.setError(null);
      render();
    });
  }

  function bindEventListeners() {
    handleExpand();
    handleAddBookmark();
    handleEditMode();
    handleMinSelect();
    handleCollapse();
    handleDelete();
    handleEdit();
    handleCloseError();
  }

  return {
    render,
    bindEventListeners
  };
})();
