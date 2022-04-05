const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
require('dotenv').config();

const { NODE_ENV, JWT_SECRET = 'super-strong-secret' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.starsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация.'));
  }

  const token = authorization.replace('Bearer ', '');

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
