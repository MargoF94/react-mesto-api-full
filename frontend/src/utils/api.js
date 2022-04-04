class Api{
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._token = headers.authorization;
  }

  _checkResponse (res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Ошибка ${res.status}`)
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._headers,
      // headers: {
      //   authorization: this._token
      // }
    }).then(this._checkResponse)
  }

  addCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
    .then(this._checkResponse)
  };

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token
      }
    })
    .then(this._checkResponse)
  }

  getUserData() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        authorization: this._token
      }
    })
    .then(this._checkResponse)
  }

  changeUserData(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
    .then(this._checkResponse)
  };

  changeUserAvatar(avatarUrl) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        avatar: avatarUrl
      })
    })
    .then(this._checkResponse)
  }

  likeCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: {
        authorization: this._token
      }
    }).then(this._checkResponse)
  }

  removeLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: this._token
      }
    })
    .then(this._checkResponse)
  }

  changeLikeCardStatus(id, isLiked) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: `${isLiked ? 'PUT' : 'DELETE'}`,
      headers: {
        authorization: this._token
      }
    }).then(this._checkResponse)
  }
}
const api = new Api({
  baseUrl: 'api.local-mesto.nomoredomains.work',
  headers: {
    authorization: `${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  }
});

export default api;