
import PubSub from 'pubsub-js';
import ComponentController from 'app/mvc/controllers/ComponentController';
import StateStorage from 'app/mvc/storage/StateStorage';
import CountryDetailsService from 'app/quote/services/CountryDetailsService';
import WindowNavigationService from 'app/mvc/services/WindowNavigationService';

class QuoteAppController extends ComponentController {
  static constitute () { return [CountryDetailsService, StateStorage,
    ...ComponentController.constitute()]; }

  constructor (countryDetailsService, stateStorage,
    ...dependencies) {
    super(...dependencies);

    this.countryDetailsService = countryDetailsService;
    this.stateStorage = stateStorage;
  }

  bindView () {
    super.bindView();

    let state = this.stateStorage.getState();
    let countryCode = state.countryCode;
    let coverType = state.coverType;

    if (countryCode) {
      this.countryDetailsService
        .getCountryDetails(coverType, countryCode)
        .then(this.countryDetailsReceived.bind(this));
    } else {
      onCountryMissing();
    }
  }

  onCountryMissing () {

  }

  countryDetailsReceived (countryDetails) {
    if (countryDetails.BackgroundImageUrl) {
      this.view.setBackgroundImage('url("' + countryDetails.BackgroundImageUrl + '")');
    } else {
      this.view.setDefaultBackgroundImage();
    }
  }
}

export { QuoteAppController as default };
