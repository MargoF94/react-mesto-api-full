const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

const { JWT_SECRET = 'super-strong-secret' } = process.env;

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// возвращает пользователя по _id
module.exports.getUserdById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный _id.'));
      } else if (err.status === 404) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  console.log(`In middleware getCurrentUser: user _id: ${req.params._id}`);

  const { authorization } = req.headers;
  if (!authorization) {
    next(new UnauthorizedError('Нет доступа.'));
  }

  return User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Введенный email уже зарегестрирован.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// обновляет данные пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new UnauthorizedError('Пожалуйста, зарегестрируйтесь.'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const id = user._id;
      const token = jwt.sign(
        { _id: user._id },
        // NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      console.log(`JWT in Login Controller: ${token}`);
      console.log(`user id in Login Controller: ${id}`);
      return res.send({ jwt: token, _id: id });
    })
    .catch((err) => {
      console.log(`In User controllers: error: ${err}`);
      next(new UnauthorizedError('Не удалось войти в систему.'));
    })
    .catch(next);
};
