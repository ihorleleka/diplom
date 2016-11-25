import PubSub from 'pubsub-js';
import StateStorage from './StateStorage';

class SessionStateStorage extends StateStorage {
  static constitute () { return [...StateStorage.constitute()]; }

  constructor (reducers, context, ...dependencies) {
    super(...dependencies);

    this.reducers = Array.isArray(reducers) ? reducers : [reducers];

    this.setState({});

    if (Array.isArray(context)) {
      context.forEach(contextName => {
        PubSub.subscribe(contextName, this.bindState.bind(this));
      });
    } else {
      PubSub.subscribe(context, this.bindState.bind(this));
    }
  }

  bindState (msg, data) {
    let newState = this.getState();
    this.reducers.forEach(reducer => {
      newState = reducer(newState, msg, data);
    });
    this.setState(newState);
  }

  getState () {
    var state = {};
    for (var propName in sessionStorage) {
      if (sessionStorage.hasOwnProperty(propName)) {
        try {
          var value = JSON.parse(sessionStorage[propName]);
        } catch (e) {
          var value = sessionStorage[propName];
        }

        state[propName] = value;
      }
    }

    return state;
  }

  setState (newState) {
    for (var propName in newState) {
      var newValue = newState[propName];
      if (typeof newValue === 'string') {
        sessionStorage.setItem(propName, newValue);
      } else if (newValue === null) {
        sessionStorage.removeItem(propName);
      } else if (newValue instanceof Date) {
        sessionStorage.setItem(propName, newValue);
      } else {
        sessionStorage.setItem(propName, JSON.stringify(newValue));
      }
    }
  }
}

export { SessionStateStorage as default };
