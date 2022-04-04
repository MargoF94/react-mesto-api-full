export const baseUrl = 'https://auth.nomoreparties.co';

const request = ({endPoint, method = 'POST', token, body}) => {
  const config = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // если есть токен, добаляем эту строчку в заголовки
      ...!!token && { 'Authorization': `Bearer ${token}` }
    },
    // если есть тело, добавляет эту строчку
    ...!!body && { body: JSON.stringify(body) },
  }
  return fetch(`${baseUrl}/${endPoint}`, config)
    .then((res) => {
        if (res.ok){
          return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`)
    })
}

export const getContent = (token) => {
  return request({
    endPoint: 'users/me',
    method: 'GET',
    token
  })
}

export const register = (email, password) => {
  return request({
    endPoint: 'signup',
    body: { email, password }
  })
}

export const authorize = (email, password) => {
  return request({
    endPoint: 'signin',
    body: { email, password }
  })
}