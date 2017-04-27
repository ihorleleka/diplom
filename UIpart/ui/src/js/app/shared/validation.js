import $ from 'jquery';

var validation = (function () {
  'use strict';

  var validation = {
    init: function () {
      validation.bindEvents();
    },

    bindEvents: function () {
      $('button').click(function (event) {
        var pageForValidation = $(this).parents('.page');
        if ($(this).parent()[0].localName != 'a') {
          validation.validatePage(pageForValidation);
        }
      });
    },

    validatePage: function (page) {
      var inputs = page.find('input, textarea');
      inputs.removeClass('error');

      inputs.each(function (index) {
        var $input = $(this);
        var regexAttr = $input.attr('regex');
        if (regexAttr != undefined) {
          var regExp = new RegExp(regexAttr);
          var value = $input.val();
          if (!regExp.test(value)) {
            $input.addClass('error');
          }

          $input.change(function () {
            $(this).removeClass('error');
          });
        }
      });

      return !page.find('.error').length > 0;
    }
  };

  return {
    init: validation.init,
    validatePage: validation.validatePage
  };
}());

if (typeof module !== 'undefined') {
  module.exports = validation;
}
