class BaseComponent {
  static constitute () { return []; }

  constructor (...dependencies) {
    if (this.constructor === BaseComponent) {
      throw new TypeError('BaseComponent cannot be instantiated directly');
    }
  }

  initialise () {

  }

  destroy () {
  }
}

export { BaseComponent as default };
