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
      location.reload();
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
      expires = '; expires=' + date.toUTCString();
      document.cookie = 'olymp_dp_cookie' + '=' + login.encrypt(login.objToString(value))
      + expires + '; path=/';
    },

    readCookie: function () {
      var nameEQ = 'olymp_dp_cookie' + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return login.decrypt(c.substring(nameEQ.length, c.length));
      }

      return null;
    },

    objToString: function (obj) {
      var str = '';
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str += p + '=' + obj[p] + ';';
        }
      }

      return str;
    },

    encrypt: function (text) {
      var output = new String;
      var Temp = new Array();
      var Temp2 = new Array();
      var TextSize = text.length;
      for (var i = 0; i < TextSize; i++) {
        var rnd = Math.round(Math.random() * 122) + 68;
        Temp[i] = text.charCodeAt(i) + rnd;
        Temp2[i] = rnd;
      }

      for (var i = 0; i < TextSize; i++) {
        output += String.fromCharCode(Temp[i], Temp2[i]);
      }

      return output;
    },

    decrypt: function (text) {
      var output = new String;
      var Temp = new Array();
      var Temp2 = new Array();
      var TextSize = text.length;
      for (var i = 0; i < TextSize; i++) {
        Temp[i] = text.charCodeAt(i);
        Temp2[i] = text.charCodeAt(i + 1);
      }

      for (var i = 0; i < TextSize; i = i + 2) {
        output += String.fromCharCode(Temp[i] - Temp2[i]);
      }

      return output;
    }
  };

  return {
    init: login.init,
    readCookie: login.readCookie
  };
}());

if (typeof module !== 'undefined') {
  module.exports = login;
}
