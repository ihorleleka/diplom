import BaseComponent from './BaseComponent';
import PubSub from 'pubsub-js';

class ControllerRepository extends BaseComponent {
  constructor (...dependencies) {
    super(...dependencies);

    this.controllers = [];
  }

  addController (controller) {
    this.controllers.push(controller);
  }

  getControllers () {
    return this.controllers;
  }

  hasController (controllerType) {
    return this.controllers.find(controller => controller instanceof controllerType);
  }
}

export { ControllerRepository as default };
