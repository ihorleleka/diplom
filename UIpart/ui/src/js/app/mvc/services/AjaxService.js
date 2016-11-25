
import $ from 'jquery';
import AjaxUrlTransform from './AjaxUrlTransform';

class AjaxService {
  static constitute () { return [
      AjaxUrlTransform
    ]; }

  constructor (ajaxUrlTransform) {
    this.ajaxUrlTransform = ajaxUrlTransform;
  }

  get (url, settings = {}) {
    if (this.ajaxUrlTransform) {
      url = this.ajaxUrlTransform.transformUrl(url, settings);
    }

    return $.ajax(
      Object.assign({ url: url }, settings)
    );
  }

  post (url, dataType = null, settings = {}) {
    if (this.ajaxUrlTransform) {
      url = this.ajaxUrlTransform.transformUrl(url, settings);
    }

    let postOptions = Object.assign({
        url: url,
        data: JSON.stringify(dataType),
        type: 'POST',
        contentType: 'application/json'
      }, settings);

    return $.ajax(postOptions);
  }
}

export { AjaxService as default };
