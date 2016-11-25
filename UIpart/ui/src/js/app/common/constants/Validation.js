export const EmailConstants = {
  EmailRegex: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/
};

export const NumberConstants = {
  NumberRegex: /^\d+$/
};

export const DateConstants = {
  DayRegex: /^[0-9]{2}$/g,
  MonthRegex: /^[0-9]{2}$/g,
  YearRegex: /^[0-9]{4}$/g,
};

export const ExpiryDateConstants = {
  MonthRegex: /^[0-9]{2}$/g,
  YearRegex: /^[0-9]{2}$/g,
};

export const ValidationKey = {
  Email: 'email',
  Required: 'required',
  Date: 'date',
  ExpiryDate: 'expiryDate',
  Telephone: 'telephone',
  Number: 'number',
  Regex: 'regex'
};

export const ValidationMessageKey = {
  InvalidEmail: 'invalidEmail',
  InvalidNumber: 'invalidNumber',
  RequiredValue: 'requiredValue',
  InvalidDate: 'invalidDate',
  InvalidDateDay: 'invalidDateDay',
  InvalidDateMonth: 'invalidDateMonth',
  InvalidDateYear: 'invalidDateYear',
  InvalidMaxAge: 'invalidMaxAge',
  InvalidMinAge: 'invalidMinAge',
  InvalidExpiryDateMonth: 'invalidExpiryDateMonth',
  InvalidExpiryDateYear: 'invalidExpiryDateYear',
  InvalidCountryCode: 'invalidCountryCode',
  InvalidTelephoneNumber: 'invalidTelephoneNumber',
  CountryCodeRequired: 'countryCodeRequired',
  TelephoneNumberRequired: 'telephoneNumberRequired',
  InvalidRegex: 'invalidRegex'
};
