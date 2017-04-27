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
      var inputs = page.find('input');
      console.log(inputs);
    }
  };

  return {
    init: registration.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = registration;
}
