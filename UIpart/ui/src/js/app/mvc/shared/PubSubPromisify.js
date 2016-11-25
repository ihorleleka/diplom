import PubSub from 'pubsub-js';

class PubSubPromisify {
  constructor (resolveTopics, rejectTopics) {
    this.promise = new Promise((resolve, reject) => {
      this.resolveSubscriptionTokens = resolveTopics.map((resolveTopic) =>
        PubSub.subscribe(resolveTopic, (msg, data) => {
          this.unsubscribeAll();
          resolve(data);
        })
      );

      this.rejectSubscriptionTokens = rejectTopics.map((rejectTopic) =>
        PubSub.subscribe(rejectTopic, (msg, data) => {
          this.unsubscribeAll();
          reject(data);
        })
      );
    });
  }

  static subscribe (resolveTopics, rejectTopics) {
    let psp = new PubSubPromisify(resolveTopics, rejectTopics);
    return psp.promise;
  }

  unsubscribeAll () {
    [...this.resolveSubscriptionTokens, ...this.rejectSubscriptionTokens]
      .forEach((token) => {
        PubSub.unsubscribe(token);
      });
  }

  destroy () {
    this.unsubscribeAll();
  }
}

export { PubSubPromisify as default};
