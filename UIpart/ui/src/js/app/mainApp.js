import $ from 'jquery';
import './vendor/vendor';

var sideNavigation = require('pushy');
var headerFunction = require('./shared/header.js');
var footerFunction = require('./shared/footer.js');
var navigationContent = require('./shared/navigationContent.js');
var singlePageNavigation = require('./shared/singlePageNavigation.js');
var validation = require('./shared/validation.js');
var registration = require('./shared/registration.js');
var login = require('./shared/login.js');
var feedBack = require('./shared/feedBack.js');
var requestSender = require('./shared/requestSender.js');
var accountService = require('./shared/accountService.js');
var becomeTrainer = require('./shared/becomeTrainer.js');
var editMode = require('./shared/editMode.js');
var olymp = require('./shared/olymp.js');

class MainApp {
  static run (mode) {
    $(function () {
      if ($('.main-navigation').length) {
        requestSender.init();
        navigationContent.init().then(function () {
          if ($('.mobile-navigation').length) {
            sideNavigation.init();
          }

          if ($('.header').length) {
            headerFunction.init();
          }

          if ($('.footer').length) {
            footerFunction.init();
          }

          if ($('.pages').length) {
            singlePageNavigation.init();
            validation.init();
            registration.init();
            login.init();
            feedBack.init();
            accountService.init();
            becomeTrainer.init();
            editMode.init();
            olymp.init();
          }
        });
      }
    });
  }
}

export { MainApp as default };
