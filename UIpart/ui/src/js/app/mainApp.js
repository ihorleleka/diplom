import $ from 'jquery';
import './vendor/vendor';

var sideNavigation = require('pushy');
var headerFunction = require('./shared/header.js');
var footerFunction = require('./shared/footer.js');

class MainApp {
  static run (mode) {
    $(document).ready(function () {
      if ($('.mobile-navigation').length) {
        sideNavigation.init();
      }

      if ($('.header').length) {
        headerFunction.init();
      }

      if ($('.footer').length) {
        footerFunction.init();
      }
    });
  }
}

export { MainApp as default };
