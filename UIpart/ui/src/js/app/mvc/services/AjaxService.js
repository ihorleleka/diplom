
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
        data: dataType,
        type: 'POST',
        datatype: 'html'
      }, settings);

    return $.ajax(postOptions);
  }
}

export { AjaxService as default };
