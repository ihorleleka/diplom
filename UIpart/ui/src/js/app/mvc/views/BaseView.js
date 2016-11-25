import BaseComponent from '../shared/BaseComponent';
import ViewContext from 'app/mvc/views/ViewContext';

class BaseView extends BaseComponent {
  static constitute () { return [ViewContext, ...BaseComponent.constitute()]; }

  constructor (context, ...dependencies) {
    super(...dependencies);

    if (this.constructor === BaseView) {
      throw new TypeError('BaseView cannot be instantiated directly');
    }

    this.context = context;
    this.$context = $(context);
  }

   bind (eventName, handler) {

   }

   unbind (eventName) {

   }

  setElementVisible ($element, visible) {
    if (visible) {
      $element.show();
    } else {
      $element.hide();
    }
  }

  setValidationMessageVisible ($element, visible) {
    this.setElementVisible($element, visible);
  }

  toggleError (visible) {
    this.toggleValidationError($(this.context), visible);
  }

  toggleElementClass ($element, className, hasClass) {
    if (hasClass) {
      $element.addClass(className);
    } else {
      $element.removeClass(className);
    }
  }

  disableInputFields (disable) {
    $(this.context).find('input, select').attr('disabled', disable);
  }

  toggleValidationError ($element, visible) {
    this.toggleElementClass($element, 'has-error', visible);
  }

  isVisible () {
    return $(this.context).is(':visible');
  }

  setVisible (visible) {
    this.setElementVisible($(this.context), visible);
  }

  getProperties () {
    return $(this.context).data();
  }

  scrollToModuleError () {
    let $errorContext = $('.has-error:first');
    $('html, body').animate({
      scrollTop: $errorContext.offset().top - 200
    }, 400);
  }
}

export { BaseView as default };
