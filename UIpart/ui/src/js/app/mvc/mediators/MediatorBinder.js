
import PubSub from 'pubsub-js';
import ControllerRepository from 'app/mvc/shared/ControllerRepository';
import { Container } from 'constitute';

class MediatorBinder {
  static constitute () { return [Container, ControllerRepository]; }

  constructor (container, controllerRepository) {
    this.container = container;
    this.controllerRepository = controllerRepository;
  }

  createMediator (MediatorType) {
    return this.container.constitute(MediatorType);
  }

  createMediatorDefinition (mediatorTypes) {
    return mediatorTypes.map(mediatorType => ({ mediatorType }));
  }

  bindMediators (mediatorTypes) {
    'use strict';

    const mediatorDefinitions = this.createMediatorDefinition(mediatorTypes);

    mediatorDefinitions.forEach((mediatorDefinition) => {
      let mediator = this.createMediator(mediatorDefinition.mediatorType);

      mediator.subscribeAll();
      mediator.initialise();
    });
  }
}

export { MediatorBinder as default };
