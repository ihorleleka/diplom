class URLBuilder {
  static setVariables (url, variables) {
    let resultUrl = url;

    let getUrlKeyTemplate = (key) => [
      '${' + key + '}',
      ':' + key
    ];

    Object.keys(variables).forEach((key) => {
      let variableURIEncodedValue = encodeURIComponent(variables[key]);

      getUrlKeyTemplate(key).forEach(urlKeyTemplate => {
        resultUrl = resultUrl.replace(urlKeyTemplate, variableURIEncodedValue);
      });
    });

    let unusedVariables = Object.keys(variables).filter((key) => {
      if (!variables[key]) {
        return false;
      }

      let keyFound = false;
      getUrlKeyTemplate(key).forEach(urlKeyTemplate => {
        if (url.indexOf(urlKeyTemplate) >= 0) {
          keyFound = true;
        }
      });

      return !keyFound;
    });

    if (unusedVariables.length > 0) {
      resultUrl = resultUrl + '?';

      let variablesUrlComponent = unusedVariables.map((key) => {
        let variableURIEncodedValue = encodeURIComponent(variables[key]);

        return key + '=' + variableURIEncodedValue;
      }).join('&');

      resultUrl = resultUrl + variablesUrlComponent;
    }

    return resultUrl;
  }

  static stripTrailingSlash (url)
  {
    // if site has an end slash (like: www.example.com/),
    // then remove it and return the site without the end slash
    // Match a forward slash / at the end of the string ($)
    if (url) {
      return url.replace(/\/$/, '');
    } else {
      return url;
    }
  }

  static addSubPath (url, subPath)
  {
    let resultUrl = URLBuilder.stripTrailingSlash(url);
    resultUrl = resultUrl + '/' + subPath;

    return resultUrl;
  }

  static getParentPath (url) {
    let urlWithoutQueryString = url.replace(/\?.*$/, '');
    let urlWithoutTrailingSlash = URLBuilder.stripTrailingSlash(urlWithoutQueryString);
    let parentUrl = urlWithoutTrailingSlash.replace(/\/[^\/]+$/, '');

    return parentUrl;
  }
}

export { URLBuilder as default };
