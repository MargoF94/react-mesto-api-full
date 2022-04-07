export const baseUrl = 'https://api.local-mesto.nomoredomains.work';

const request = ({endPoint, method = 'POST', jwt, body}) => {
  const config = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // если есть токен, добаляем эту строчку в заголовки
      ...!!jwt && { 'Authorization': `Bearer ${jwt}` }
    },
    // если есть тело, добавляет эту строчку
    ...!!body && { body: JSON.stringify(body) },
  }
  return fetch(`${baseUrl}/${endPoint}`, config)
    .then((res) => {
        if (res.ok){
          return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
}

export const getContent = (jwt) => {
  return request({
    endPoint: 'users/me',
    method: 'GET',
    jwt,
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
  return request({
    endPoint: 'signup',
    body: { email, password },
  })
}

export const authorize = (email, password) => {
  return request({
    endPoint: 'signin',
    body: { email, password },
  })
  .then((res) => {
    if (res.jwt) {
      localStorage.setItem('jwt', res.jwt)
    }
  });
}