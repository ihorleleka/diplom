
class DateService {
  getDate (value) {
    return new Date();
  }

  static formatDate (date) {
    let utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return utcDate.toISOString().slice(0, 10);
  }
}

export { DateService as default };
