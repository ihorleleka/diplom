import SubscriptionComponent from '../shared/SubscriptionComponent';

class BaseController extends SubscriptionComponent {
  static constitute () { return ['view', ...SubscriptionComponent.constitute()]; }

  constructor (view, ...dependencies) {
    super(...dependencies);

    if (this.constructor === BaseController) {
      throw new TypeError('BaseController cannot be instantiated directly');
    }

    this.view = view;
    this.model = {};
    this.bindedViewEvents = [];
    this.eventRegistry = {};
  }

  bindView () {
  }

  onViewChangeValue () {
    this.trigger('change', this);
    this.trigger('validate', this);
  }

  unbindView () {
    this.bindedViewEvents.forEach((event) => {
      this.view.unbind(event);
    });
  }

  bindViewEvent (eventName, handler) {
    this.view.bind(eventName, handler);

    this.bindedViewEvents.push(eventName);
  }

  destroy () {
    this.unbindView();
    super.destroy();
  }

  hasChanges () {

  }

  bind (eventName, handler) {
    this.eventRegistry[eventName] = handler;
  }

  trigger (eventName, ...parameter) {
    if (this.eventRegistry.hasOwnProperty(eventName)) {
      this.eventRegistry[eventName](...parameter);
    }
  }

  getProperties () {
    return this.view.getProperties();
  }
}

export { BaseController as default };
