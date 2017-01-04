
import $ from 'jquery';

class AjaxService {
 static get (url, settings = {}) {
    return $.ajax(
      Object.assign({ url: url }, settings)
    );
  }

 static post (url, dataType = null, settings = {}) {
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
