import $ from 'jquery';
import login from './login.js';
import PubSub from 'pubsub-js';

var accountService = (function () {
  'use strict';

  var accountService = {
    userInfo: {},
    init: function () {
      accountService.bindEvents();
      var info = login.readCookie();
      if (info != null) {
        accountService.userInfo.id = info.id;
        PubSub.publishSync('getUserInfo', accountService.userInfo);
      }
    },

    bindEvents: function () {
      PubSub.subscribe('userInfoReceived', accountService.userInfoReceived);
      var $logout = $('.pages .profile button.logout');
      $logout.click(function () {
        document.cookie = 'olymp_dp_cookie' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = window.location.href;
      });
    },

    userInfoReceived: function (msg, data) {
      accountService.userInfo = data;
      accountService.populateData();
    },

    populateData: function () {
      var editHtml = `<div class="edit-button">
                                <div class="edit">
                                    <a class="edit">
                                        <i class="icon icon-pencil-solid"></i>
                                        Редагувати
                                    </a>
                                </div>
                            </div>`;
      var $profilePage = $('.pages .profile');
      var $userInfo = $profilePage.find('.user-info');
      var $emailBlock = $profilePage.find('.user-email');
      $userInfo.html(accountService.userInfo.lastName + ' '
        + accountService.userInfo.firstName + ' '
        + accountService.userInfo.fatherName + editHtml);
      $emailBlock.html(accountService.userInfo.email + editHtml);
    }
  };
  return {
    init: accountService.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = accountService;
}
