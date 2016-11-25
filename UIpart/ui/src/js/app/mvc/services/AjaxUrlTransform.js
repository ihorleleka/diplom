
import LanguageService from 'app/shared/LanguageService';

class AjaxUrlTransform {
  static constitute () { return [
      LanguageService
    ]; }

  constructor (languageService) {
    this.languageService = languageService;
  }

  transformUrl (url, settings = {}) {
    let languageCode = settings.languageCode;

    if (!languageCode) {
      languageCode = this.languageService.getLanguageCode();
    }

    if (languageCode) {
      url = '/' + languageCode + url;
    }

    return url;
  }
}

export { AjaxUrlTransform as default };
