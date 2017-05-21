import $ from 'jquery';
import validation from './validation.js';
import PubSub from 'pubsub-js';

var login = (function () {
  'use strict';

  var login = {
    init: function () {
      login.bindEvents();
      PubSub.subscribe('loginSuccess', login.loginSuccess);
      PubSub.subscribe('loginFail', login.loginFail);
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
    },

    loginSuccess: function (msg, data) {
      login.createCookie(data, 14);
    },

    loginFail: function (msg, data) {
      var $loginPageBottom = $('.loginPage .row .col-xs-12 .buttons-block');
      $loginPageBottom.find('p').remove();
      $loginPageBottom.append(`<p>${data.xhr.responseText}</p>`);
      $('.loginPage button.login').removeClass('clicked');
    },

    createCookie: function (value, days) {
      var expires = '';
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toGMTString();
      document.cookie = 'olymp_dp_cookie=' + login.encode(value.id, '123') + expires + ';path=/';
      location.reload();
    },

    readCookie: function () {
      var nameEQ = 'olymp_dp_cookie=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
          return login.decode(c.substring(nameEQ.length, c.length), '123');
        }
      }

      return null;
    },

    encode: function (s, k) {
      var enc = '';
      var str = '';
      str = s.toString() + '5274';
      for (var i = 0; i < str.length; i++) {
        var a = str.charCodeAt(i);
        var b = a ^ k;
        enc = enc + String.fromCharCode(b);
      }

      return enc;
    },

    decode: function (s, k) {
      var enc = '';
      for (var i = 0; i < s.length; i++) {
        var a = s.charCodeAt(i);
        var b = a ^ k;
        enc = enc + String.fromCharCode(b);
      }

      return (parseInt(enc) - 5274) / 10000;
    }
  };

  return {
    init: login.init,
    readCookie: login.readCookie,
    createCookie: login.createCookie
  };
}());

if (typeof module !== 'undefined') {
  module.exports = login;
}
