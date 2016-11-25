class Logger {
  static log (category, message, ...vars) {
    console.log(category, message, ...vars);
  }
}

export { Logger as default };
