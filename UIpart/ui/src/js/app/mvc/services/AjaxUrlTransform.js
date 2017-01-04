

class AjaxUrlTransform {
  static constitute () { }

  constructor () {
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
