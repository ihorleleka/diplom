import $ from 'jquery';
import './vendor/vendor';

var sideNavigation = require('pushy');
var headerFunction = require('./shared/header.js');
var footerFunction = require('./shared/footer.js');
var navigationContent = require('./shared/navigationContent.js');
var singlePageNavigation = require('./shared/singlePageNavigation.js');
var validation = require('./shared/validation.js');

class MainApp {
  static run (mode) {
    $(function () {
      if ($('.main-navigation').length) {
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
          }
        });
      }
    });
  }
}

export { MainApp as default };
