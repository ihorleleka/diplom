import $ from 'jquery';

var singlePageNavigation = (function () {
  'use strict';

  var singlePageNavigation = {
    pagesContainer: $('.pages'),
    pages: $('.pages .page'),
    errorPage: $('.pages .errorPage'),
    loginPage: $('.pages .loginPage'),
    regPage: $('.pages .regPage'),

    init: function () {
      let mainPage = singlePageNavigation.pagesContainer.find('[name="main-page"]');
      singlePageNavigation.showSpecificPage(mainPage);
      singlePageNavigation.bindEvents();
    },

    bindEvents: function () {
      $('a[dest]').click(function (event) {
        event.preventDefault();
        let nameOfPageToRedirect = $(this).attr('dest');
        let findExpression = '[name="' + nameOfPageToRedirect + '"]';
        let pageToRedirect = singlePageNavigation.pagesContainer.find(findExpression);
        singlePageNavigation.showSpecificPage(pageToRedirect);
      });

      $('body').on('click', '.mobile-navigation a[dest]', function (e) {
        e.preventDefault();
        let nameOfPageToRedirect = $(this).attr('dest');
        let findExpression = '[name="' + nameOfPageToRedirect + '"]';
        let pageToRedirect = singlePageNavigation.pagesContainer.find(findExpression);
        singlePageNavigation.showSpecificPage(pageToRedirect);
        $('.sb-close').click();
      });
    },

    showSpecificPage: function (page) {
      singlePageNavigation.pagesContainer = $('.pages');
      singlePageNavigation.pages = $('.pages .page');
      singlePageNavigation.pages.fadeOut(1);
      if (page.length > 0) {
        singlePageNavigation.pages.addClass('hidden');
        page.removeClass('hidden');
        page.fadeIn('slow');
      } else {
        singlePageNavigation.errorPage.removeClass('hidden');
        singlePageNavigation.errorPage.fadeIn('slow');
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
