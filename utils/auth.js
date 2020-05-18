const jwt = require('jsonwebtoken');

module.exports = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { isAuth: false };
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, 'mysupersecret');
  } catch (err) {
    return { isAuth: false };
  }

  if (!decodedToken) {
    return { isAuth: false };
  }

  const { userId, role } = decodedToken;

  return { isAuth: true, userId, role };
};
