const { AuthenticationError } = require('apollo-server-express');

exports.checkAuthentication = (context) => {
  if (!context.authScope.isAuth) {
    const error = new AuthenticationError('Usuário não autenticado.');
    error.code = 401;
    throw error;
  }
};
