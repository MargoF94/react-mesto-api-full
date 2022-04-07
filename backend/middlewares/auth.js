const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
require('dotenv').config();

const { JWT_SECRET = 'super-strong-secret' } = process.env;

module.exports = (req, res, next) => {
  console.dir(req.headers);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Пожалуйста, авторизуйтесь.'));
  }
  console.log(authorization);
  console.log(`Headers: ${req.headers}`);
  const token = authorization.replace('Bearer ', '');

  // const authorization = req.cookies.jwt;
  // if (!authorization) {
  //   next(new UnauthorizedError('Пожалуйста, авторизуйтесь.'));
  // }
  console.log(authorization);

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(
      token,
      JWT_SECRET,
    );
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedError('Необходима авторизация.'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
