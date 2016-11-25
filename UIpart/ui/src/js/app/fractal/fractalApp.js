import SessionStateStorage from 'app/mvc/storage/SessionStateStorage';
import StateStorage from 'app/mvc/storage/StateStorage';
import { Container } from 'constitute';
import PubSub from 'pubsub-js';
import bindViews from './fractalAppViewBinder';
import 'app/vendor/vendor';

class FractalApp {
  static run (mode, settings) {
    'use strict';

    //add depedency injection overrides (mocks)
    let container = new Container();
    let ssh = new SessionStateStorage();
    container.bindValue(StateStorage, ssh);

    bindViews(container);
  }
}

export { FractalApp as default};
