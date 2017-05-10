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
      PubSub.subscribe('SendFeedback', requestSender.sendFeedback);
      PubSub.subscribe('loginAttempt', requestSender.login);
    },

    registrationHandler: function (msg, data) {
      AjaxService.post('registration.php', data)
      .done(function (msg) {
        PubSub.publishSync('registrationComplete', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('registrationFail', { xhr: xhr, status: status, error: error });
      });
    },

    sendFeedback: function (msg, data) {
      AjaxService.post('feedback.php', data)
      .done(function (msg) {
        PubSub.publishSync('feedbackSent', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('feedbackSendFail', { xhr: xhr, status: status, error: error });
      });
    },

    login: function (msg, data) {
      AjaxService.post('login.php', data)
      .done(function (msg) {
        PubSub.publishSync('loginSuccess', msg);
      })
      .fail(function (xhr, status, error) {
        PubSub.publishSync('loginFail', { xhr: xhr, status: status, error: error });
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
