require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {
  validateSignUp,
  validateSignIn,
} = require('./middlewares/validators');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError'); // 404
const auth = require('./middlewares/auth');

const app = express();
// app.use(cookieParser()); // подключаем парсер кук как мидлвэр

const {
  createUser,
  login,
} = require('./controllers/users');

// подклюение к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const corsOptions = {
  origin: [
    'https://local-mesto.nomoredomains.xyz',
    'http://local-mesto.nomoredomains.xyz',
    'https://localhost:3001',
    'http://localhost:3001',
  ],
};

app.use(express.json());

app.use(cors(corsOptions));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.use('/', routerUsers);
app.use('/', routerCards);
app.use('*', () => {
  throw new NotFoundError('Указан неверный путь');
});

app.use(errorLogger); // подключаем логгер ошибок

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(3000, () => {
  console.log("I'm working!");
});
