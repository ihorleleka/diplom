import $ from 'jquery';

var matchHeightInitialize = (function () {
  'use strict';

  var matchHeightInitialize = {
    init: function () {

      $('.match-height').matchHeight({
        byRow: true,
      });

    },
  };

  return {
    init: matchHeightInitialize.init,
  };

}());

if (typeof module !== 'undefined') {
  module.exports = matchHeightInitialize;
}
