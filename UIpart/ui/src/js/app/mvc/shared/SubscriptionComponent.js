import BaseComponent from './BaseComponent';
import PubSub from 'pubsub-js';

class SubscriptionComponent extends BaseComponent {
  static constitute () { return [...BaseComponent.constitute()]; }

  constructor (...dependencies) {
    super(...dependencies);

    if (this.constructor === SubscriptionComponent) {
      throw new TypeError('SubscriptionComponent cannot be instantiated directly');
    }

    this.subscriptionTokens = [];
  }

  subscribe (topic, handler) {
    let subscriptionToken = PubSub.subscribe(topic, handler);

    this.subscriptionTokens.push(subscriptionToken);
  }

  subscribeAll () {
  }

  unsubscribeAll () {
    this.subscriptionTokens.forEach((subscriptionToken) => {
      PubSub.unsubscribe(subscriptionToken);
    });
  }

  initialise () {

  }

  destroy () {
    this.unsubscribeAll();
    super.destroy();
  }
}

export { SubscriptionComponent as default };
