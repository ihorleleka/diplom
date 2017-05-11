import $ from 'jquery';
import validation from './validation.js';
import PubSub from 'pubsub-js';

var registration = (function () {
  'use strict';

  var registration = {
    init: function () {
      registration.bindEvents();
      PubSub.subscribe('registrationComplete', registration.registrationComplete);
      PubSub.subscribe('registrationFail', registration.registrationError);
    },

    bindEvents: function () {
      $('.regPage button.reg').click(function (event) {
        var pageForRegistration = $(this).parents('.page');
        if (validation.validatePage(pageForRegistration) && !$(this).hasClass('clicked')) {
          $(this).addClass('clicked');
          var data = registration.collectData(pageForRegistration);
          PubSub.publishSync('RegistrationAttempt', data);
        }
      });
    },

    collectData: function (page) {
      var collectedData = {};
      collectedData.email = page.find('.email').val();
      collectedData.password = page.find('.password').val();
      collectedData.firstName = page.find('.name').val();
      collectedData.lastName = page.find('.surname').val();
      collectedData.fatherName = page.find('.father_name').val();
      return collectedData;
    },

    registrationComplete: function (msg, data) {
      var $loginPageRegButton = $('.loginPage a[dest="regPage"]');
      $loginPageRegButton.remove();
      var $regPageBottom = $('.regPage .row .col-xs-12 .buttons-block');
      $regPageBottom.find('p').remove();
      $regPageBottom.append('<p>На указану Вами поштову адресу було відправлено '
        + 'email повідомлення для підтвердження реєстрації</p>');
    },

    registrationError: function (msg, data) {
      var $regPageBottom = $('.regPage .row .col-xs-12 .buttons-block');
      $regPageBottom.find('p').remove();
      $regPageBottom.append(`<p>${data.xhr.responseText}</p>`);
      $('.regPage button.reg').removeClass('clicked');
    }
  };

  return {
    init: registration.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = registration;
}
