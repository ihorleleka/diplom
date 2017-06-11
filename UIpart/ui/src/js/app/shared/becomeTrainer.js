import $ from 'jquery';
import validation from './validation.js';
import PubSub from 'pubsub-js';
import accountService from './accountService.js';

var becomeTrainer = (function () {
  'use strict';

  var becomeTrainer = {
    data: null,
    userInfo: null,
    deletePage: true,
    init: function () {
      becomeTrainer.bindEvents();
      PubSub.subscribe('becomeTrainerSuccess', becomeTrainer.becomeTrainerSuccess);
      PubSub.subscribe('becomeTrainerFail', becomeTrainer.becomeTrainerFail);
      PubSub.subscribe('getDivisionsSuccess', becomeTrainer.getDivisionsSuccess);
      PubSub.publishSync('getDivisions');
      PubSub.subscribe('userInfoReceived', becomeTrainer.userInfoReceived);
    },

    userInfoReceived: function (msg, data) {
      becomeTrainer.userInfo = data;
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

      $('a[dest="profile"]').click(function (event) {
        becomeTrainer.initList();
        $(this).off(event);
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
      becomeTrainer.data = data;
    },

    initList: function () {
      becomeTrainer.data.forEach(function (division) {
        becomeTrainer.divisionSelectAddOption(division.name, division.id);
      });

      becomeTrainer.deleteEverything(becomeTrainer.deletePage);
    },

    divisionSelectAddOption: function (optionText, optionId) {
      if (becomeTrainer.checkOption(optionId)) {
        var $choseDivisionSelect = $('.becomeTrainer .chose-division');
        $choseDivisionSelect.append(`<option value="${optionId}">${optionText}</option>`);
        becomeTrainer.deletePage = false;
      }
    },

    checkOption: function (optionId) {
      var result = true;
      becomeTrainer.userInfo.roles.forEach(function (obj) {
        if (obj.division_id == optionId && obj.role_id != 2) {
          result = false;
        }
      });

      return result;
    },

    deleteEverything: function (toDel) {
      if (toDel) {
        $('a[dest="becomeTrainer"]').remove();
        $('.page.becomeTrainer').remove();
      }
    }
  };

  return {
    init: becomeTrainer.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = becomeTrainer;
}
