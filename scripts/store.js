'use strict';

const store = (function(){

  const items = [
    {
      id:  '',
      title: '',
      url: '',
      desc: '',
      rating: 1,
      opened: false,
    }
  ];

  const minVal = 0;

  const editMode = true;

  return {
    items,
    minVal,
    editMode,
  };
  

}());