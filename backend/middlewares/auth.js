const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
require('dotenv').config();

// const { JWT_SECRET = 'super-strong-secret' } = process.env;
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  console.dir(req.headers);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('Couldnt find authorization header');
    next(new UnauthorizedError('Пожалуйста, сначала авторизуйтесь.'));
  }
  console.log(`Authorization: ${req.headers.authorization}`);
  console.log(`Headers: ${req.headers}`);
  console.log(`JWT_SECRET: ${JWT_SECRET}`);
  const token = authorization.replace('Bearer ', '');

  // console.log(`Token: ${token}`);

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
