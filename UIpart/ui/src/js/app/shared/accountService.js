import $ from 'jquery';
import login from './login.js';
import PubSub from 'pubsub-js';
import validation from './validation.js';

var accountService = (function () {
  'use strict';

  var accountService = {
    userInfo: {},
    init: function () {
      accountService.bindEvents();
      var info = login.readCookie();
      if (info != null) {
        accountService.userInfo.id = info;
        PubSub.publishSync('getUserInfo', accountService.userInfo);
        PubSub.publishSync('getTrainersList');
      }
    },

    bindEvents: function () {
      PubSub.subscribe('userInfoReceived', accountService.userInfoReceived);
      PubSub.subscribe('trainersListReceived', accountService.trainersListReceived);
      PubSub.subscribe('updateUserDataSuccess', accountService.updateUserDataSuccess);
      PubSub.subscribe('updateUserDataFail', accountService.updateUserDataFail);
      var $logout = $('.pages .profile button.logout');
      $logout.click(function () {
        document.cookie = 'olymp_dp_cookie=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        location.reload();
      });

      $('.page.userAddInfo button').click(function () {
        var currentPage = $(this).parents('.page');
        if (validation.validatePage(currentPage) && !$(this).hasClass('clicked')) {
          $(this).addClass('clicked');
          $('body').addClass('blured');
          PubSub.publishSync('updateUserData', accountService.collectAdditionalData());
        }
      });
    },

    isInRole: function (roles, roleId) {
      var result = false;
      roles.forEach(function (obj) {
        if (obj.role_id == roleId) {
          result = true;
        }
      });

      return result;
    },

    userInfoReceived: function (msg, data) {
      accountService.userInfo = data;
      accountService.populateData();
      accountService.additionalInfoBlockHandle();
      accountService.initProfileEdit();
    },

    additionalInfoBlockHandle: function () {
      if (accountService.isInRole(accountService.userInfo.roles, '1') ||
        accountService.isInRole(accountService.userInfo.roles, '2') ||
        accountService.isInRole(accountService.userInfo.roles, '3')) {
        $('.page.userAddInfo').remove();
        $('a[dest="userAddInfo"]').remove();
      }

      if (accountService.userInfo.additionalInfo) {
        var $additionalInfoPage = $('.page.userAddInfo');
        $('a[dest="userAddInfo"] button')
        .html('Редагувати додаткову інформацію <i class="icon icon-chevron-right"></i>');
        $additionalInfoPage.find('h2').text('Редагування вказанної Вами інформації');
        $additionalInfoPage.find('.date-of-birth')
        .val(accountService.userInfo.additionalInfo.dateOfBirth);
        $additionalInfoPage.find('.chose-trainer')
        .val(accountService.userInfo.additionalInfo.trainer_id);
        $additionalInfoPage.find('.study-place')
        .val(accountService.userInfo.additionalInfo.studyPlace);
        $additionalInfoPage.find('.additional-info')
        .val(accountService.userInfo.additionalInfo.additionalInfo);
        $additionalInfoPage.find('.mobile-number')
        .val(accountService.userInfo.additionalInfo.telephone);
      }
    },

    populateData: function () {
      var $profilePage = $('.pages .profile');
      var $userInfo = $profilePage.find('.user-info');
      var $emailBlock = $profilePage.find('.user-email');
      $userInfo.html(accountService.userInfo.lastName + ' '
        + accountService.userInfo.firstName + ' '
        + accountService.userInfo.fatherName);
      $emailBlock.html(accountService.userInfo.email);
    },

    trainersListReceived: function (msg, data) {
      var $choseTrainerSelect =  $('.page.userAddInfo .chose-trainer');
      data.forEach(function (item) {
        $choseTrainerSelect.append(`<option value="${item.id}">${item.lastName +
          ' ' + item.firstName + ' ' + item.fatherName}</option>`);
      });
    },

    collectAdditionalData: function () {
      var collectedData = {};
      var $additionalInfoPage = $('.page.userAddInfo');
      accountService.userInfo.additionalInfo.dateOfBirth
        = $additionalInfoPage.find('.date-of-birth').val();
      accountService.userInfo.additionalInfo.trainer_id
        = $additionalInfoPage.find('.chose-trainer').val();
      accountService.userInfo.additionalInfo.studyPlace
        = $additionalInfoPage.find('.study-place').val();
      accountService.userInfo.additionalInfo.additionalInfo
        = $additionalInfoPage.find('.additional-info').val();
      accountService.userInfo.additionalInfo.telephone
        = $additionalInfoPage.find('.mobile-number').val();
      return accountService.userInfo;
    },

    updateUserDataSuccess: function (msg, data) {
      accountService.populateData();
      accountService.additionalInfoBlockHandle();
      var $profilePage = $('.pages .profile');
      $profilePage.find('.click-part').show();
      $profilePage.find('.edit-part').hide();
      $('.page.userAddInfo button').removeClass('clicked');
      $('body').removeClass('blured');
    },

    updateUserDataFail: function (msg, data) {
      var $additionalInfoPage = $('.userAddInfo .row .col-xs-12 .buttons-block');
      $additionalInfoPage.find('p').remove();
      $additionalInfoPage.append(`<p>${data.xhr.responseText}</p>`);
      $('.page.userAddInfo button').removeClass('clicked');
      $('body').removeClass('blured');
    },

    initProfileEdit: function () {
      var $profilePage = $('.pages .profile');
      var $editParts = $profilePage.find('.edit-block .edit-part');
      $editParts.hide();
      $editParts.find('.surname').val(accountService.userInfo.lastName);
      $editParts.find('.name').val(accountService.userInfo.firstName);
      $editParts.find('.father_name').val(accountService.userInfo.fatherName);
      $editParts.find('.email').val(accountService.userInfo.email);
      $profilePage.find('.edit-block .click-part a').click(function () {
        var $parent = $(this).parents('.edit-block');
        $parent.find('.click-part').hide();
        $parent.find('.edit-part').show();
      });

      $profilePage.find('.edit-block .edit-part a').click(function () {
        if (validation.validatePage($profilePage)) {
          var $parent = $(this).parents('.edit-block');
          $parent.find('.click-part').show();
          $parent.find('.edit-part').hide();
          accountService.saveNewUserValues();
        }
      });
    },

    saveNewUserValues: function () {
      var $profilePage = $('.pages .profile');
      var $editParts = $profilePage.find('.edit-block .edit-part');
      $profilePage.find('.edit-block .click-part').show();
      accountService.userInfo.firstName = $editParts.find('.name').val();
      accountService.userInfo.lastName = $editParts.find('.surname').val();
      accountService.userInfo.fatherName = $editParts.find('.father_name').val();
      accountService.userInfo.email = $editParts.find('.email').val();
      accountService.userInfo.newPassword = $editParts.find('.password').val();
      $('body').addClass('blured');
      PubSub.publishSync('updateUserData', accountService.userInfo);
    }
  };
  return {
    init: accountService.init,
    userInfo: accountService.userInfo
  };
}());

if (typeof module !== 'undefined') {
  module.exports = accountService;
}
