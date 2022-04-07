class Api{
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
  }

  _checkResponse (res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Ошибка ${res.status}`)
  }

  getInitialCards(jwt) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
    }).then(this._checkResponse)
  }

  addCard(name, link, jwt) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
    .then(this._checkResponse)
  };

  deleteCard(id, jwt) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
    })
    .then(this._checkResponse)
  }

  getUserData(jwt) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
    })
    .then(this._checkResponse)
  }

  changeUserData(name, about, jwt) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
    .then(this._checkResponse)
  };

  changeUserAvatar(avatarUrl, jwt) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      credentials: 'include',
      body: JSON.stringify({
        avatar: avatarUrl
      })
    })
    .then(this._checkResponse)
  }

  likeCard(id, jwt) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
    }).then(this._checkResponse)
  }

  removeLike(id, jwt) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
    })
    .then(this._checkResponse)
  }

  changeLikeCardStatus(id, isLiked, jwt) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: `${isLiked ? 'PUT' : 'DELETE'}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
    }).then(this._checkResponse)
  }
}
const api = new Api({
  baseUrl: 'https://api.local-mesto.nomoredomains.work',
});

export default api;