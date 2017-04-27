import $ from 'jquery';
import validation from './validation.js';

var feedBack = (function () {
  'use strict';

  var feedBack = {
    init: function () {
      feedBack.bindEvents();
    },

    bindEvents: function () {
      $('.feedbackPage button.send').click(function (event) {
        var pageForFeedBack = $(this).parents('.page');
        if (validation.validatePage(pageForFeedBack)) {
          feedBack.collectData(pageForFeedBack);
        }
      });
    },

    collectData: function (page) {
      var collectedData = {};
      collectedData.email = page.find('.email').val();
      collectedData.name = page.find('.name').val();
      collectedData.comment = page.find('.comment').val();
      console.log(collectedData);
    }
  };

  return {
    init: feedBack.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = feedBack;
}
