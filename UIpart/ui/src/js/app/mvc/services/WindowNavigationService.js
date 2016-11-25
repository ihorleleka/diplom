
import $ from 'jquery';
import StateStorage from 'app/mvc/storage/StateStorage';
import LanguageService from 'app/shared/LanguageService';
import URLBuilder from  'app/mvc/shared/URLBuilder';
import WindowNavigationUrlTransform from './WindowNavigationUrlTransform';

class WindowNavigationService {
  static constitute () { return [
      StateStorage,
      WindowNavigationUrlTransform
    ]; }

  constructor (stateStorage,
    windowNavigationUrlTransform) {
    this.stateStorage = stateStorage;
    this.windowNavigationUrlTransform = windowNavigationUrlTransform;
  }

  openUrlTemplate (urlTemplate, variables, settings = null) {
    let url = URLBuilder.setVariables(urlTemplate, variables);

    this.openUrl(url, settings);
  }

  openUrl (url, settings = null) {
    if (this.windowNavigationUrlTransform) {
      url = this.windowNavigationUrlTransform.transformUrl(url, settings);
    }

    this.setWindowUrl(url, settings);
  }

  setWindowUrl (url, settings = null) {
    window.location.href = url;
  }

  getWindowUrl () {
    let url = window.location.href;
    return url;
  }
}

export { WindowNavigationService as default };
