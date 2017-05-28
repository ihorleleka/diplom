import $ from 'jquery';
import validation from './validation.js';
import PubSub from 'pubsub-js';
import accountService from './accountService.js';

var becomeTrainer = (function () {
  'use strict';

  var becomeTrainer = {
    init: function () {
      becomeTrainer.bindEvents();
      PubSub.subscribe('becomeTrainerSuccess', becomeTrainer.becomeTrainerSuccess);
      PubSub.subscribe('becomeTrainerFail', becomeTrainer.becomeTrainerFail);
      PubSub.subscribe('getDivisionsSuccess', becomeTrainer.getDivisionsSuccess);
      PubSub.subscribe('getDivisionsFail', becomeTrainer.getDivisionsFail);
      PubSub.publishSync('getDivisions');
    },

    bindEvents: function () {
      $('.becomeTrainer button.send').click(function (event) {
        var becomeTrainerPage = $(this).parents('.page');
        if (validation.validatePage(becomeTrainerPage) && !$(this).hasClass('clicked')) {
          $(this).addClass('clicked');
          var data = becomeTrainer.collectData(becomeTrainerPage);
          data.userId = accountService.userInfo.id;
          PubSub.publishSync('becomeTrainer', data);
        }
      });
    },

    collectData: function (page) {
      var collectedData = {};
      collectedData.division = page.find('.chose-division').val();
      collectedData.comment = page.find('.comment').val();
      return collectedData;
    },

    becomeTrainerSuccess: function (msg, data) {
      location.reload();
    },

    becomeTrainerFail: function (msg, data) {
      var $becomeTrainerPageBottom = $('.becomeTrainer .row .col-xs-12 .buttons-block');
      $becomeTrainerPageBottom.find('p').remove();
      $becomeTrainerPageBottom.append(`<p>${data.xhr.responseText}</p>`);
      $('.becomeTrainer button.send').removeClass('clicked');
    },

    getDivisionsSuccess: function (msg, data) {
      data.forEach(function (division) {
        becomeTrainer.divisionSelectAddOption(division.name, division.id);
      });
    },

    getDivisionsFail: function (msg, data) {
    },

    divisionSelectAddOption: function (optionText, optionId) {
      var $choseDivisionSelect = $('.becomeTrainer .chose-division');
      $choseDivisionSelect.append(`<option value="${optionId}">${optionText}</option>`);
    }
  };

  return {
    init: becomeTrainer.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = becomeTrainer;
}
