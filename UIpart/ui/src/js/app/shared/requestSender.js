import $ from 'jquery';
import PubSub from 'pubsub-js';
import AjaxService from 'app/mvc/services/AjaxService';

var requestSender = (function () {
  'use strict';

  var requestSender = {
    init: function () {
      requestSender.bindEvents();
    },

    bindEvents: function () {
      PubSub.subscribe('RegistrationAttempt', requestSender.registrationHandler);
    },

    registrationHandler: function (msg, data) {
      AjaxService.post('registration.php', data)
      .done(function (msg) {
        PubSub.publishSync('registrationComplete', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('registrationFail', { xhr: xhr, status: status, error: error });
      });
    }
  };

  return {
    init: requestSender.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = requestSender;
}
