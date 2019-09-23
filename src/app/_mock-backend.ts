import Cookies from 'js-cookie';
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';
import uuid from 'uuidv4';
import helpers from './_helpers';

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
  authenticationIsUnauthorised: 'authentication-is-unauthorised',
}

const errorObject = val => ({ error: val });

/* cookies posing as database. whole logic here. */
let users;
let loggedInUsers;

const getUsers = () => {
  let usersCookie = Cookies.get('users');
  users = usersCookie ? JSON.parse(usersCookie) : [];
}
const getLoggedInUsers = () => {
  let loggedInUsersCookie = Cookies.get('loggedInUsers');
  loggedInUsers = loggedInUsersCookie ? JSON.parse(loggedInUsersCookie) : {};
}

const setUser = user => {
  const id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;

  users.push({ ...user, id });

  Cookies.set('users', JSON.stringify(users));

  return id
}

const updateUser = user => {
  var index = users.findIndex(nextUser => nextUser.id === user.id);

  users.splice(index, 1, { ...user, password: users[index].password, });

  Cookies.set('users', JSON.stringify(users));
}

const setLoggedInUser = id => {
  const token = uuid();

  loggedInUsers[token] = id;

  Cookies.set('loggedInUsers', JSON.stringify(loggedInUsers));

  return token;
}

const removeLoggedInUser = token => {
  delete loggedInUsers[token];

  Cookies.set('loggedInUsers', JSON.stringify(loggedInUsers));
}

getUsers()
getLoggedInUsers()
/* end of posing database */

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

    if (phoneNumber && !helpers.isPhoneNumberValid(phoneNumber)) {
      errors.phoneNumber = errorCodes.registrationPhoneNumberIsInvalid;
    }

    return errors;
  }

  register (user) {
    const errors = this.validateRegisteringUser(user)

    if (Object.keys(errors).length) {
      return errorObject(errors)
    }

    setUser(user)

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

    const token = setLoggedInUser(user.id)

    return { token };
  }

  isLoggedIn (token) {
    return !!loggedInUsers[token];
  }

  logout (token) {
    if (!this.isLoggedIn(token)) {
      return errorObject(errorCodes.authenticationIsUnauthorised);
    }

    removeLoggedInUser(token)

    return {}
  }

  getUser (token) {
    if (!this.isLoggedIn(token)) {
      return errorObject(errorCodes.authenticationIsUnauthorised);
    }

    return omit(users.find(({ id }) => id === loggedInUsers[token]), ['password']);
  }

  editUser ({ newUser, token }) {
    if (!this.isLoggedIn(token)) {
      return errorObject(errorCodes.authenticationIsUnauthorised);
    }

    // validate newUser

    updateUser(omitBy(newUser, value => (value === undefined || value === null || value === '')))

    return {}
  }
};

export default new MockBackend();
