import BaseController from 'app/mvc/controllers/BaseController';
import ViewBinder from 'app/mvc/views/ViewBinder';

class ComponentController extends BaseController {
  static constitute () { return [ViewBinder, ...BaseController.constitute()]; }

  constructor (viewBinder, ...dependencies) {
    super(...dependencies);

    this.viewBinder = viewBinder;
    this.controllers = [];
  }

  getElementDefinitions () {
    return [];
  }

  bindView () {
    let domElement = this.view.context;
    let childControllers = this.bindChildViews(domElement);
    this.controllers = childControllers;

    this.controllers.forEach(controller =>
      controller.bind('validate', this.childControllerValidate.bind(this))
    );
  }

  childControllerValidate (controller) {
    this.trigger('validate', this);
  }

  prepareChildControllerContainer (controllerContainer) {

  }

  revertChanges () {

  }

  bindChildViews (domElement) {
    const elementDefinitions = this.getElementDefinitions();
    let childControllers = this.viewBinder.bindViews(domElement, elementDefinitions,
      this.prepareChildControllerContainer.bind(this));
    this.bindChildControllers(childControllers);
    return childControllers;
  }

  bindChildControllers (childControllers) {
    childControllers.forEach(controller =>
      controller.bind('change', this.onChildControllerChange.bind(this)));
  }

  onChange () {
    this.trigger('change', this);
  }

  onChildControllerChange (controller) {
    this.onChange();
  }

  validate (options) {
    let isValid = true;
    let messages = [];

    this.controllers.forEach(controller => {
      if (controller.view.isVisible()) {
        let validationInfo = controller.validate(options);
        if (validationInfo.messages) {
          validationInfo.messages.forEach(message => messages.push(message));
        }

        if (!validationInfo.isValid) {
          isValid = false;
        }
      }
    });
    this.innerValidate(options);
    return {
      isValid,
      messages
    };
  }

  loadData () {
    return Promise.all(this.controllers.map(controller => {
      if (typeof controller.loadData === 'function') {
        return controller.loadData();
      } else {
        return Promise.resolve();
      }
    }));
  }

  save (options = { saveHiddenComponents: false }) {
    let saveChain = this.controllers.filter(function (controller) {
      return options.saveHiddenComponents || controller.view.isVisible();
    }).map(controller => controller.save(options));
    let innerSavePromise = this.innerSave(options);
    saveChain.push(innerSavePromise);

    return Promise.all(saveChain);
  }

  innerSave (options = {}) {
    return Promise.resolve();
  }

  innerValidate (options) {

  }

  activate (active) {
    return Promise.all(this.controllers.map(controller => {
      if (typeof controller.activate !== 'undefined') {
        controller.activate(active);
      }
    }));
  }
}

export { ComponentController as default };
