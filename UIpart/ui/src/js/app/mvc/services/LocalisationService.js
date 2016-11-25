class LocalisationService {

  get (key) {
    return window[key];
  }
}

export { LocalisationService as default };
