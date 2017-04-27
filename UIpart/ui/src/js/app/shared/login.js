import $ from 'jquery';
import validation from './validation.js';

var login = (function () {
  'use strict';

  var login = {
    init: function () {
      login.bindEvents();
    },

    bindEvents: function () {
      $('.loginPage button.login').click(function (event) {
        var pageForLogin = $(this).parents('.page');
        if (validation.validatePage(pageForLogin)) {
          login.collectData(pageForLogin);
        }
      });
    },

    collectData: function (page) {
      var collectedData = {};
      collectedData.email = page.find('.email').val();
      collectedData.password = page.find('.password').val();
      console.log(collectedData);
    }
  };

  return {
    init: login.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = login;
}
