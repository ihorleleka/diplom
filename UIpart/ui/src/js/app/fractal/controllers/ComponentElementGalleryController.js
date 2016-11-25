
import ComponentController from 'app/mvc/controllers/ComponentController';
import CountryListService from 'app/quote/services/CountryListService';

class ComponentElementGalleryController extends ComponentController {
  static constitute () { return [...ComponentController.constitute()]; }

  constructor (...dependencies) {
    super(...dependencies);
  }

  getElementDefinitions () {
    return [];
  }
}

export { ComponentElementGalleryController as default };
