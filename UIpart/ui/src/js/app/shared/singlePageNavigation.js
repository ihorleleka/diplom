import $ from 'jquery';

var singlePageNavigation = (function () {
  'use strict';

  var singlePageNavigation = {
    pagesContainer: $('.pages'),
    pages: $('.pages .page'),
    errorPage: $('.pages .errorPage'),

    init: function () {
      singlePageNavigation.showMainPage(true);
      singlePageNavigation.bindEvents();
    },

    showMainPage: function (show) {
      singlePageNavigation.pages.hide();
      let mainPage = singlePageNavigation.pagesContainer.find('[name="main-page"]');
      if (show) {
        mainPage.show();
      } else {
        mainPage.hide();
      }
    },

    bindEvents: function () {
      $('a[dest]').click(function (event) {
        event.preventDefault();
        let nameOfPageToRedirect = $(this).attr('dest');
        let findExpression = '[name="' + nameOfPageToRedirect + '"]';
        let pageToRedirect = singlePageNavigation.pagesContainer.find(findExpression);
        singlePageNavigation.showSpecificPage(pageToRedirect);
      });
    },

    showSpecificPage: function (page) {
      singlePageNavigation.pages.hide();
      if (page.length > 0) {
        page.show();
      } else {
        singlePageNavigation.errorPage.show();
      }
    }
  };

  return {
    init: singlePageNavigation.init
  };
}());

if (typeof module !== 'undefined') {
  module.exports = singlePageNavigation;
}
