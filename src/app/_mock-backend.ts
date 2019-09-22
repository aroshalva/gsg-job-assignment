import Cookies from 'js-cookie'

interface Errors {
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  repeatedPassword?: string,
  phoneNumber?: string
}

const errorObject = val => ({ error: val });

let usersCookie = Cookies.get('users');
let users = usersCookie ? JSON.parse(usersCookie) : [];

const mockLoginToken = 'mock-login-token';

class MockBackend {
  isEmailValid (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  isPhoneNumberValid (phoneNumber) {
    return /^\d+$/.test(String(phoneNumber));
  }

  validateRegisteringUser ({ firstName, lastName, email, password, repeatedPassword, phoneNumber }) {
    const errors: Errors = {}

    if (!firstName) {
      errors.firstName = "First Name is required";
    }
    if (!lastName) {
      errors.lastName = "Last Name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!this.isEmailValid(email)) {
      errors.email = "Email is not valid"
    } else if (users.find(user => user.email === email)) {
      errors.email = 'Email "' + email + '" is already taken'
    }

    if (!password || !repeatedPassword) {
      if (!password) {
        errors.password = "Password Name is required";
      }
      if (!repeatedPassword) {
        errors.repeatedPassword = "Repeated Password is required";
      }
    } else if (password !== repeatedPassword) {
      errors.repeatedPassword = "Repeated Password is not equal to password";
    }

    if (!this.isPhoneNumberValid(phoneNumber)) {
      errors.phoneNumber = "Phone number is not valid";
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

  login ({ email, password }) {
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
      return errorObject('Email or password is incorrect');
    }

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
