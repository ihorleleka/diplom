import $ from 'jquery';
import './vendor/vendor';

var sideNavigation = require('pushy');
var headerFunction = require('./shared/header.js');
var footerFunction = require('./shared/footer.js');
var singlePageNavigation = require('./shared/singlePageNavigation.js');

class MainApp {
  static run (mode) {
    $(function () {
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
      }

      console.log('ama rdy!!');
    });
  }
}

export { MainApp as default };
