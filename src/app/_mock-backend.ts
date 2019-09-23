import Cookies from 'js-cookie'
import helpers from './_helpers'

interface Errors {
  email?: string,
  password?: string,
  repeatedPassword?: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
}

const errorCodes = {
  registrationEmailIsRequired: 'registration-email-is-required',
  registrationEmailIsInvalid: 'registration-email-is-invalid',
  registrationEmailIsAlreadyTaken: 'registration-email-is-already-taken',
  registrationPasswordIsRequired: 'registration-password-is-required',
  registrationRepeatedPasswordIsRequired: 'registration-repeated-password-is-required',
  registrationRepeatedPasswordIsNotEqualToPassword: 'registration-repeated-password-is-not-equal-to-password',
  registrationFirstNameIsRequired: 'registration-first-name-is-required',
  registrationLastNameIsRequired: 'registration-last-name-is-required',
  registrationPhoneNumberIsInvalid: 'registration-phone-number-is-invalid',
  loginEmailIsRequired: 'login-email-is-required',
  loginEmailIsInvalid: 'login-email-is-invalid',
  loginEmailIsNotRegistered: 'login-email-is-not-registered',
  loginPasswordIsRequired: 'login-password-is-required',
  loginPasswordIsIncorrect: 'login-password-is-incorrect',
}

const errorObject = val => ({ error: val });

let usersCookie = Cookies.get('users');
let users = usersCookie ? JSON.parse(usersCookie) : [];

const mockLoginToken = 'mock-login-token';

class MockBackend {
  validateRegisteringUser ({ email, password, repeatedPassword, firstName, lastName, phoneNumber }) {
    const errors: Errors = {}

    if (!email) {
      errors.email = errorCodes.registrationEmailIsRequired;
    } else if (!helpers.isEmailValid(email)) {
      errors.email = errorCodes.registrationEmailIsInvalid
    } else if (users.find(user => user.email === email)) {
      errors.email = errorCodes.registrationEmailIsAlreadyTaken
    }

    if (!password || !repeatedPassword) {
      if (!password) {
        errors.password = errorCodes.registrationPasswordIsRequired;
      }
      if (!repeatedPassword) {
        errors.repeatedPassword = errorCodes.registrationRepeatedPasswordIsRequired;
      }
    } else if (password !== repeatedPassword) {
      errors.repeatedPassword = errorCodes.registrationRepeatedPasswordIsNotEqualToPassword;
    }

    if (!firstName) {
      errors.firstName = errorCodes.registrationFirstNameIsRequired;
    }
    if (!lastName) {
      errors.lastName = errorCodes.registrationLastNameIsRequired;
    }

    if (!helpers.isPhoneNumberValid(phoneNumber)) {
      errors.phoneNumber = errorCodes.registrationPhoneNumberIsInvalid;
    }

    return errors;
  }

  register (user) {
    const errors = this.validateRegisteringUser(user)

    if (Object.keys(errors).length) {
      return errorObject(errors)
    }

    users.push({ ...user, id: users.length ? Math.max(...users.map(nextUser => nextUser.id)) + 1 : 1 });

    Cookies.set('users', JSON.stringify(users));

    return {};
  }

  validateLoginInfo ({ email, password }) {
    const errors: Errors = {}

    if (!email) {
      errors.email = errorCodes.loginEmailIsRequired;
    } else if (!helpers.isEmailValid(email)) {
      errors.email = errorCodes.loginEmailIsInvalid
    }

    if (!password) {
      errors.password = errorCodes.loginPasswordIsRequired;
    }

    if (!Object.keys(errors).length) {
      const matchedEmailUser = users.find(user => user.email === email);

      if (!matchedEmailUser) {
        errors.email = errorCodes.loginEmailIsNotRegistered
      } else if (matchedEmailUser.password !== password) {
        errors.password = errorCodes.loginPasswordIsIncorrect
      } else {
        return { valid: matchedEmailUser }
      }
    }

    return errors;
  }

  login (loginInfo) {
    const validationResult:any = this.validateLoginInfo(loginInfo)

    if (!validationResult.valid) {
      return errorObject(validationResult)
    }

    const user = validationResult.valid

    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token: mockLoginToken
    };
  }

  isLoggedIn (token) {
    return token === mockLoginToken;
  }

  unauthorized () {
   return errorObject('Unauthorised');
  }

  getUsers (token) {
    if (!this.isLoggedIn(token)) {
      return this.unauthorized();
    }

    return users;
  }

  deleteUser ({ id, token }) {
    if (!this.isLoggedIn(token)) {
      return this.unauthorized();
    }

    if (!users.find(user => user.id === id)) {
      return 'There is no user with this id: "' + id + '"'
    }

    users = users.filter(user => user.id !== id);

    Cookies.set('users', JSON.stringify(users));

    return {};
  }
};

export default new MockBackend();
