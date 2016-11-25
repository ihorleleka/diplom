import $ from 'jquery';
import ControllerRepository from '../shared/ControllerRepository';
import ViewContext from './ViewContext';
import { Container } from 'constitute';

class ViewBinder {
  static constitute () { return [Container, ControllerRepository]; }

  constructor (container, controllerRepository) {
    this.container = container;
    this.controllerRepository = controllerRepository;
  }

  bindViews (context, elementDefinitions, controllerContainerHandler) {

    let controllers = [];

    elementDefinitions.forEach((elementDefinition) => {

      let cssSelector = elementDefinition.viewType.cssSelector();

      let domElements = null;

      if (cssSelector !== null) {
        domElements = $(cssSelector, context).addBack(cssSelector);
      } else {
        domElements = $(elementDefinition.viewType.domElement());
      }

      domElements.each((i, element) => {
        const viewContainer = this.container.createChild();

        viewContainer.bindValue(ViewContext, element);

        let view = viewContainer.constitute(elementDefinition.viewType);

        let controller = null;

        if (typeof elementDefinition.controllerType.constitute === 'function') {
          const controllerContainer = this.container.createChild();
          controllerContainer.bindValue('view', view);

          if (typeof controllerContainerHandler === 'function') {
            controllerContainerHandler(controllerContainer);
          }

          controller = controllerContainer.constitute(elementDefinition.controllerType);
        } else {
          controller = typeof elementDefinition.controllerConstructor === 'function' ?
            elementDefinition.controllerConstructor(elementDefinition, element, view)
              : new elementDefinition.controllerType(view);
        }

        this.controllerRepository.addController(controller);
        controller.bindView();
        controller.subscribeAll();
        controller.initialise();

        controllers.push(controller);

        //controller.unbindView();
        //controller.unsubscribeAll();
      });
    });

    return controllers;
  }
}

export { ViewBinder as default };
