import $ from 'jquery';

var footerFunction = (function () {
  'use strict';

  var footerFunction = {

    init: function () {
      $('.footer a').each(function () {
        var tempUrl = $(this).attr('href');
        if (tempUrl === '') {
          $(this).addClass('empty-link');
          $(this).removeAttr('href');
        }
      });
    },
  };

  return {
    init: footerFunction.init,
  };

}());

if (typeof module !== 'undefined') {
  module.exports = footerFunction;
}
