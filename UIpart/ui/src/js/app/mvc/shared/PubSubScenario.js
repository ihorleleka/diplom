import SubscriptionComponent from './SubscriptionComponent';
import PubSub from 'pubsub-js';

const PubSubScenarioState = {
  STOPPED: 'stopped',
  STARTED: 'started',
};

const PUBSUB_SCENARIO_WHEN_AWAIT_TIMEOUT = 5000;
const PUBSUB_SCENARIO_TASK_QUEUE_DELAY = 0;

class PubSubScenarioWhenAwaitStep {
  constructor (action, condition) {
    this.action = action;
    this.condition = condition;
    this.state = PubSubScenarioState.STOPPED;

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  start () {
    this.state = PubSubScenarioState.STARTED;

    setTimeout(() => {
      if (this.state === PubSubScenarioState.STARTED) {
        this.reject();
      }
    }, PUBSUB_SCENARIO_WHEN_AWAIT_TIMEOUT);
  }

  getPromise () {
    return this.promise;
  }

  messageReceived (msg, data) {
    if (this.state !== PubSubScenarioState.STARTED) {
      return false;
    }

    if (this.action === msg) {
      if (typeof this.condition === 'function') {
        if (!this.condition(msg, data)) {
          return false;
        }
      }

      //console.log('done', this.action);

      this.state = PubSubScenarioState.STOPPED;
      this.resolve();

      return true;
    }

    return false;
  }
}

class PubSubScenarioStepRunner {
  constructor (executionContext, flowStep) {
    this.executionContext = executionContext;
    this.flowStep = flowStep;
  }

  setStarted (promise) {
    promise.then(() => {
      this.stop();
    });
  }

  stop () {
  }

  messageReceived (msg, data) {
    return false;
  }
}

class PubSubScenarioWhenStepRunner extends PubSubScenarioStepRunner {
  constructor (executionContext, flowStep) {
    super(executionContext, flowStep);

    var actions = [];

    if (typeof flowStep.action === 'string') {
      actions.push(flowStep.action);
    } else if (typeof flowStep.action === 'object') {
      actions = flowStep.action;
    }

    this.awaitSteps = actions.map(action =>
      new PubSubScenarioWhenAwaitStep(action, flowStep.condition));
  }

  start () {
    let promise = Promise.all(this.awaitSteps.map(awaitStep => awaitStep.getPromise()));
    this.awaitSteps.forEach(awaitStep => awaitStep.start());

    this.setStarted(promise);

    return promise;
  }

  messageReceived (msg, data) {
    let messageHandled = false;

    this.awaitSteps.forEach(awaitStep => {
      if (awaitStep.messageReceived(msg, data)) {
        messageHandled = true;
      }
    });

    return messageHandled;
  }
}

class PubSubScenarioThenStepRunner extends PubSubScenarioStepRunner {
  constructor (executionContext, flowStep) {
    super(executionContext, flowStep);
  }

  start () {
    let promise = this.executionContext.taskScheduler.queueTask(() => {
      PubSub.publishSync(this.flowStep.action, this.flowStep.message);
    });

    this.setStarted(promise);

    return promise;
  }
}

class PubSubScenarioTaskScheduler {
  queueTask (handler) {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          var result = handler();

          setTimeout(() => {
            resolve(result);
          }, PUBSUB_SCENARIO_TASK_QUEUE_DELAY);
        } catch (err) {
          //console.log(err);
          reject(err);
        }
      }, PUBSUB_SCENARIO_TASK_QUEUE_DELAY);
    });

    return promise;
  }
}

export class PubSubScenarioRunner extends SubscriptionComponent {
  constructor (pubSubScenario) {
    super();

    this.pubSubScenario = pubSubScenario;
    this.currentStep = 0;
    this.state = PubSubScenarioState.STOPPED;
    this.executionContext = {
      taskScheduler: new PubSubScenarioTaskScheduler()
    };

    this.stepTypeMapping = {
      then: PubSubScenarioThenStepRunner,
      when: PubSubScenarioWhenStepRunner
    };

    this.currentRunner = null;
  }

  subscribeAll () {
    this.subscribe('Quote', this.messageReceived.bind(this));
    this.subscribe('Sme', this.messageReceived.bind(this));
    this.subscribe('Quiz', this.messageReceived.bind(this));
    this.subscribe('Travel', this.messageReceived.bind(this));
  }

  initialise () {

  }

  getFlowSteps (pubSubScenario) {
    let flowStepsResult = [];

    pubSubScenario.flowSteps.forEach(flowStep => {
      if (Object.keys(this.stepTypeMapping).find(stepType => stepType === flowStep.type)) {
        flowStepsResult.push(flowStep);
      } else if (flowStep.type === 'whenScenario') {
        let scenarioFlowSteps = this.getFlowSteps(flowStep.scenario);

        flowStepsResult = [...flowStepsResult, ...scenarioFlowSteps];
      }
    });

    return flowStepsResult;
  }

  start () {
    this.state = PubSubScenarioState.STARTED;
    this.currentStep = 0;
    this.currentRunner = null;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.unhandledMessageQueue = [];
    this.flowSteps = this.getFlowSteps(this.pubSubScenario);

    this.subscribeAll();

    this.startCurrentStep();
  }

  stop () {
    this.unsubscribeAll();
    this.state = PubSubScenarioState.STOPPED;
  }

  startCurrentStep () {
    if (this.state !== PubSubScenarioState.STARTED) {
      return null;
    }

    if (this.flowSteps.length > 0) {
      if (this.currentStep < this.flowSteps.length) {
        let flowStep = this.flowSteps[this.currentStep];

        let RunnerType = this.stepTypeMapping[flowStep.type];

        this.currentRunner = new RunnerType(this.executionContext, flowStep);

        let promise = this.currentRunner.start();

        promise.then(() => {
          this.startNextStep();
        });

        this.runUnhandledReceivedMessages();

        return promise;
      } else {
        this.stop();

        this.resolve();

        return Promise.resolve();
      }
    }
  }

  startNextStep () {
    this.currentStep++;

    return this.startCurrentStep();
  }

  messageReceived (msg, data) {
    this.messageReceivedInner(msg, data);

    //setTimeout(() => this.messageReceivedInner(msg, data), 0);
  }

  messageReceivedInner (msg, data) {
    if (this.state !== PubSubScenarioState.STARTED) {
      return;
    }

    let messageHandled = this.currentRunner.messageReceived(msg, data);

    if (!messageHandled) {
      this.unhandledMessageQueue.push({ msg, data });
    } else {
      this.unhandledMessageQueue = [];
    }
  }

  runUnhandledReceivedMessages () {
    let spliceIndex = -1;

    this.unhandledMessageQueue.forEach((unhandledMessage, index) => {
      let messageHandled = this.currentRunner
        .messageReceived(unhandledMessage.msg, unhandledMessage.data);

      if (messageHandled) {
        spliceIndex = index;
      }
    });

    if (spliceIndex >= 0) {
      this.unhandledMessageQueue.splice(0, spliceIndex + 1);
    }
  }
}

class PubSubScenario {
  constructor (properties) {
    this.flowSteps = [];
    this.properties = properties;
  }

  when (action, condition) {
    this.flowSteps.push({ type: 'when', action, condition });

    return this;
  }

  whenScenario (scenario) {
    this.flowSteps.push({ type: 'whenScenario', scenario });

    return this;
  }

  then (action, message) {
    this.flowSteps.push({ type: 'then', action, message });

    return this;
  }
}

export { PubSubScenario as default };
