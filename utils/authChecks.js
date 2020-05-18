const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');

exports.checkAuthentication = (context) => {
  if (!context.authScope.isAuth) {
    const error = new AuthenticationError('Usuário não autenticado.');
    error.code = 401;
    throw error;
  }
};

exports.checkAuthorization = (context) => {
  if (context.authScope.role !== 'admin') {
    const error = new ForbiddenError('Usuário sem permissão.');
    error.code = 403;
    throw error;
  }
};
