import $ from 'jquery';
import validation from './validation.js';
import PubSub from 'pubsub-js';

var login = (function () {
  'use strict';

  var login = {
    init: function () {
      login.bindEvents();
    },

    bindEvents: function () {
      $('.loginPage button.login').click(function (event) {
        var pageForLogin = $(this).parents('.page');
        if (validation.validatePage(pageForLogin) && !$(this).hasClass('clicked')) {
          $(this).addClass('clicked');
          var data = login.collectData(pageForLogin);
          PubSub.publishSync('loginAttempt', data);
        }
      });
    },

    collectData: function (page) {
      var collectedData = {};
      collectedData.email = page.find('.email').val();
      collectedData.password = page.find('.password').val();
      return collectedData;
    }
  };

  return {
    init: login.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = login;
}
