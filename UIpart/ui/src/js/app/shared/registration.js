import $ from 'jquery';
import validation from './validation.js';

var registration = (function () {
  'use strict';

  var registration = {
    init: function () {
      registration.bindEvents();
    },

    bindEvents: function () {
      $('.regPage button.reg').click(function (event) {
        var pageForRegistration = $(this).parents('.page');
        if (validation.validatePage(pageForRegistration)) {
          registration.collectData(pageForRegistration);
        }
      });
    },

    collectData: function (page) {
      var collectedData = {};
      collectedData.email = page.find('.email').val();
      collectedData.password = page.find('.password').val();
      collectedData.name = page.find('.name').val();
      collectedData.surname = page.find('.surname').val();
      collectedData.father_name = page.find('.father_name').val();
      console.log(collectedData);
    }
  };

  return {
    init: registration.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = registration;
}
