import BadRequestError from '../utils/errors/BadRequestError'; // 400
import UnauthorizedError from '../utils/errors/UnauthorizedError'; // 401

// export const baseUrl = 'https://api.local-mesto.nomoredomains.work';

export const baseUrl = 'http://localhost:3000';


// const request = ({endPoint, method = 'POST', jwt, body}) => {
//   const config = {
//     method,
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       // если есть токен, добаляем эту строчку в заголовки
//       ...!!jwt && { 'Authorization': `Bearer ${jwt}` }
//     },
//     // если есть тело, добавляет эту строчку
//     ...!!body && { body: JSON.stringify(body) },
//   }
//   return fetch(`${baseUrl}/${endPoint}`, config)
//     .then((res) => {
//         if (res.ok){
//           return res.json();
//         }

//         return Promise.reject(`Ошибка ${res.status}`);
//     })
// }

export const getContent = (jwt) => {
  return fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${jwt}`,
    },
  })
  .then((res) => {
    console.log(`In auth.getContent: response: ${res}`);
    return res.json();
  })
}

// export const getContent = (jwt) => {
//   return fetch(`${baseUrl}/users/me`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `${jwt}`,
//     },
//   })
//   .then();
// }

export const register = (email, password) => {
  return fetch(`${baseUrl}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password})
  })
}

// export const authorize = (email, password) => {
//   return request({
//     endPoint: 'signin',
//     body: { email, password },
//   })
//   .then((res) => {
//     if (res.jwt) {
//       console.log(`In authorize: my response: ${res}`); // OK
//       console.log(`In authorize: got my JWT ${res.jwt}`); // OK
//       localStorage.setItem('jwt', res.jwt);
//       return res.jwt;
//     }
//   });
// }

export const authorize = (email, password) => {
  return fetch (`${baseUrl}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then((res) => {
    if (res.status === 400) {
      throw new BadRequestError('Заполните все поля.');
    } else if (res.status === 401) {
      throw new UnauthorizedError('Данный email еще не зарегестрирован/ Нет доступа.');
    } else {
      return res.json();
    }
  })
  .then((data) => {
    console.log(data);
      localStorage.setItem('jwt', data.jwt);
      console.log(`In frontend auth: JWT_SECRET: ${data.secretKey}`);
      return data.jwt;
  });
}