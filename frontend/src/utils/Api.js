class Api {
  constructor(url) {
    this._url = url;
  }

  getHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  _getCheckResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then(this._getCheckResponse);
  }

  getInitialCard() {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: this.getHeaders(),
    }).then(this._getCheckResponse);
  }

  updateUser(name, about) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, about }),
    }).then(this._getCheckResponse);
  }

  updateUserPhoto(link) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ avatar: link }),
    }).then(this._getCheckResponse);
  }

  addCard(name, link) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, link }),
    }).then(this._getCheckResponse);
  }

  linkCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this.getHeaders(),
    }).then(this._getCheckResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    }).then(this._getCheckResponse);
  }

  deleteCardLink(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    }).then(this._getCheckResponse);
  }
}

export const api = new Api('https://www.apiproyectodiecinueve.mooo.com');
