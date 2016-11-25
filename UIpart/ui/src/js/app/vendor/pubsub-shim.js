var PubSub = require('../../../../../node_modules/pubsub-js');
var Logger = require('app/mvc/shared/Logger').default;

var DevPubSub = {
  publishSync: function (msg, data) {
    Logger.log('PUBSUB', msg, data);
    PubSub.publishSync(msg, data);
  },

  subscribe: function (msg, data) {
    PubSub.subscribe(msg, data);
  },

  unsubscribe: function (subscriptionToken) {
    PubSub.unsubscribe(subscriptionToken);
  }
};

if (typeof module !== 'undefined') {
  module.exports = DevPubSub;
}
