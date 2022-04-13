const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
require('dotenv').config();

// const { JWT_SECRET = 'super-strong-secret' } = process.env;
const { NODE_ENV, JWT_SECRET } = process.env;

console.log(process.env.NODE_ENV);

module.exports = (req, res, next) => {
  console.dir(req.headers);
  const token = req.headers.authorization;
  if (!token) {
    console.log('Couldnt find authorization header');
    next(new UnauthorizedError('Пожалуйста, сначала авторизуйтесь.'));
  }
  console.log(`Authorization: ${token}`);
  console.log(`Headers: ${req.headers.contenttype}`);
  console.log(`JWT_SECRET: ${JWT_SECRET}`);
  // const token = authorization.replace('Bearer ', '');

  // console.log(`Token: ${token}`);

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
    );
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedError('Необходима авторизация.'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
