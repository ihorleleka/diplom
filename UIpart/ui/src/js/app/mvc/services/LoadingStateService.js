import { UXAnimationDuration } from 'app/quote/constants/UXConstants';

class LoadingStateService {
  createNew (options) {
    return new LoadingState(options);
  }
}

class LoadingState {
  constructor (options) {
    this.options = options;
    this.isLoading = false;
    this.timeout = null;
  }

  handler () {
    return this.handlerRunner.bind(this);
  }

  handlerRunner (...data) {
    if (!this.isLoading) {
      this.isLoading = true;

      if (typeof this.options.setIsDisabledHandler === 'function') {
        this.options.setIsDisabledHandler(true, ...data);
      }

      if (typeof this.options.setHasErrorHandler === 'function') {
        this.options.setHasErrorHandler(false, ...data);
      }

      this.timeout = setTimeout(() => {
        this.options.setIsLoadingHandler(true, ...data);
      }, UXAnimationDuration.LOADING_TIMEOUT);

      this.promise = this.options.actionHandler(...data)
      .then(() => {
        this.promiseCompleted(...data);
      }, (reason) => {
        this.promiseCompleted(...data);

        if (typeof this.options.setHasErrorHandler === 'function') {
          this.options.setHasErrorHandler(true, ...data);
        }

        return reason;
      });
    }
  }

  promiseCompleted (...data) {
    this.isLoading = false;

    if (typeof this.options.setIsDisabledHandler === 'function') {
      this.options.setIsDisabledHandler(false, ...data);
    }

    this.options.setIsLoadingHandler(false, ...data);
    clearTimeout(this.timeout);
  }
}

export { LoadingStateService as default};
