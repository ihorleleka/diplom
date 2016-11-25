import $ from 'jquery';

var headerFunction = (function () {
  'use strict';

  var headerFunction = {

    lastScrollTop: 0,
    SCROLL_SPEED_LATENCY: 15,
    subNavOpen: false,

    init: function () {

      headerFunction.secondaryNavigation();
      headerFunction.closeSecondaryNav();

      $(window).scroll(function () {
        headerFunction.headerScroll();
      });
    },

    closeSecondaryNav: function () {
      $('body').click(function (event) {

        if (headerFunction.subNavOpen == true) {
          if ((event.target.className != 'sub-navigation js-sub-navigation') &&
            (event.target.className != 'js-has-sub-navigation has-sub-navigation') &&
            (event.target.className != 'js-enable-third-level third-level') &&
            (event.target.className != 'js-enable-third-level third-level active')) {
            $('.js-sub-navigation').fadeOut();
            $('.relative-arrow').fadeOut();
            $('.primary, .secondary').removeClass('enable-sub-level');
            $('.js-has-sub-navigation').removeClass('js-enabled');
            headerFunction.subNavOpen = false;
          }
        }
      });
    },

    secondaryNavigation: function () {
      headerFunction.thirdLevelNavigation();
      var $subNavTrigger = $('.js-has-sub-navigation');
      var $subNav = $('.js-sub-navigation');

      $subNavTrigger.on('click', function (e) {

        e.preventDefault();
        if (!$(this).hasClass('js-enabled')) {
          $subNavTrigger.removeClass('js-enabled');
          $subNav.hide();
          $('.relative-arrow').hide();
          $(this).parent().find('.js-sub-navigation').show();
          $(this).parent().find('.relative-arrow').show();
          $(this).addClass('js-enabled');
          headerFunction.subNavOpen = true;
          e.stopPropagation();
        } else {
          $('.js-sub-navigation').hide();
          $('.relative-arrow').hide();
          $('.primary, .secondary').removeClass('enable-sub-level');
          $(this).removeClass('js-enabled');
          headerFunction.subNavOpen = false;
          e.stopPropagation();
        }

      });

      $('body').on('click', '.mobile-navigation .js-has-sub-navigation', function (e) {
        e.preventDefault();
        $('.mobile-back-navigation').fadeIn();
        var $mobileSubNavigation = $(this).parent().find('.js-sub-navigation');
        $('.primary, .secondary').addClass('enable-sub-level');
        $mobileSubNavigation.fadeIn();
      });

      $('body').on('click', '.mobile-back-navigation', function () {
        $(this).fadeOut();
        $('.primary, .secondary').removeClass('enable-sub-level');
        $('.js-sub-navigation').fadeOut();
      });

    },

    thirdLevelNavigation: function () {

      $('body').on('click', '.js-enable-third-level', function (e) {
        if ($(this).attr('href').length <= 0) {
          e.preventDefault();
          $('.js-enable-third-level').removeClass('active');
          $(this).addClass('active');

          if (!($(this).parents().eq(1).hasClass('visible'))) {
            $('.sub-category').removeClass('visible');
            $(this).parents().eq(1).addClass('visible');
          }
        }

      });

    },

    headerScroll: function () {
      var scrollHeight = $(window).scrollTop();
      var $header = $('.header');
      var navHeight = $header.outerHeight();
      var distanceFromTop = $(window).scrollTop();
      var isGoingDown = distanceFromTop > headerFunction.lastScrollTop;

      if (isGoingDown) {
        if ($('.tertiary')) {
          $header.addClass('offpage-third-navigation');
        } else {
          $header.addClass('offpage');
        }

        // Hide subnavigation
        $('.js-sub-navigation').hide();
        $('.relative-arrow').hide();
        $('.primary, .secondary').removeClass('enable-sub-level');
        $('.js-has-sub-navigation').removeClass('js-enabled');
        headerFunction.subNavOpen = false;
      } else {

        if (!$('.quote-journey').length) {
          if (headerFunction.lastScrollTop < navHeight) {
            $header.removeClass('offpage offpage-third-navigation');
          }

          //Fast and slow scroll
          if (
              ((headerFunction.lastScrollTop - distanceFromTop) >
              headerFunction.SCROLL_SPEED_LATENCY)
              && (!($('.quote-tabs').length))) {
            $header.removeClass('offpage offpage-third-navigation');
          }
        }
      }

      //if we are at the top we need to show the menu
      if (distanceFromTop < navHeight) {
        $header.removeClass('offpage offpage-third-navigation');
      }

      headerFunction.lastScrollTop = distanceFromTop;
    }
  };

  return {
    init: headerFunction.init,
    secondaryNavigation: headerFunction.secondaryNavigation,
    closeSecondaryNav: headerFunction.closeSecondaryNav
  };

}());

if (typeof module !== 'undefined') {
  module.exports = headerFunction;
}
