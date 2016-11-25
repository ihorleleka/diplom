class StateStorage {
  constructor (reducer) {
    if (this.constructor === StateStorage) {
      throw new TypeError('StateStorage cannot be instantiated directly');
    }
  }

  getState () {
  }

  setState (newState) {
  }
}

export { StateStorage as default };
