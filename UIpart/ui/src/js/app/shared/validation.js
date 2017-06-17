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

    validateField: function ($field) {
      var regexAttr = $field.attr('regex');
      if (regexAttr != undefined) {
        var regExp = new RegExp(regexAttr);
        var value = $field.val();
        if (!regExp.test(value)) {
          $field.parents('.input-group').addClass('error');
        } else {
          $field.parents('.input-group').removeClass('error');
        }
      }
    },

    validateSelectField: function ($field) {
      var selectedIndex = $field[0].selectedIndex;
      if (selectedIndex == 0) {
        $field.parents('.input-group').addClass('error');
      } else {
        $field.parents('.input-group').removeClass('error');
      }
    },

    validatePage: function (page) {
      var inputs = page.find('input, textarea');
      inputs.removeClass('error');
      inputs.each(function (index) {
        var $input = $(this);
        validation.validateField($input);
        $input.change(function () {
          validation.validateField($(this));
        });
      });

      var selects = page.find('select');
      selects.each(function (index) {
        var $select = $(this);
        validation.validateSelectField($select);
        $select.change(function () {
          validation.validateSelectField($(this));
        });
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
