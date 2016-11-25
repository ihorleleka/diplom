import SubscriptionComponent from '../shared/SubscriptionComponent';

class BaseMediator extends SubscriptionComponent {
  constructor (...dependencies) {
    super(...dependencies);

    if (this.constructor === BaseMediator) {
      throw new TypeError('BaseMediator cannot be instantiated directly');
    }
  }
}

export { BaseMediator as default };
