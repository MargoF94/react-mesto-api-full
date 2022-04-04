const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'); // разрешаем кросс-доменные запросы любых типов (по умолчанию)
  res.header('Access-Control-Allow-Headers', '*'); // разрешаем кросс-доменные запросы с этими заголовками
  res.header('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  next();
});

const {
  createUser,
  login,
} = require('./controllers/users');

// подклюение к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

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
