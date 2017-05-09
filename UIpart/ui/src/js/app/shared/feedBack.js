import $ from 'jquery';
import validation from './validation.js';
import PubSub from 'pubsub-js';

var feedBack = (function () {
  'use strict';

  var feedBack = {
    init: function () {
      feedBack.bindEvents();
      PubSub.subscribe('feedbackSent', feedBack.feedbackSent);
      PubSub.subscribe('feedbackSendFail', feedBack.feedbackSendFail);
    },

    bindEvents: function () {
      $('.feedbackPage button.send').click(function (event) {
        var pageForFeedBack = $(this).parents('.page');
        if (validation.validatePage(pageForFeedBack) && !$(this).hasClass('clicked')) {
          $(this).addClass('clicked');
          var data = feedBack.collectData(pageForFeedBack);
          PubSub.publishSync('SendFeedback', data);
        }
      });
    },

    collectData: function (page) {
      var collectedData = {};
      collectedData.email = page.find('.email').val();
      collectedData.name = page.find('.name').val();
      collectedData.comment = page.find('.comment').val();
      return collectedData;
    },

    feedbackSent: function (msg, data) {
      var $feedbackPageBottom = $('.feedbackPage .row .col-xs-12 .buttons-block');
      $feedbackPageBottom.find('p').remove();
      $feedbackPageBottom.append('<p>Дякуємо за Ваше повідомлення!</p>');
    },

    feedbackSendFail: function (msg, data) {
      var $feedbackPageBottom = $('.feedbackPage .row .col-xs-12 .buttons-block');
      $feedbackPageBottom.find('p').remove();
      $feedbackPageBottom.append(`<p>${data.xhr.responseText}</p>`);
      $('.regPage button.reg').removeClass('clicked');
    }
  };

  return {
    init: feedBack.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = feedBack;
}
