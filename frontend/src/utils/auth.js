import { setToken, removeToken } from './token';

const BASE_URL = 'http://localhost:3000';

export const checkToken = async (token) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Token inválido');
  return response.json();
};

export const register = async (email, password) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Error al registrar usuario');
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Correo o contraseña incorrectos');
  const data = await response.json();
  setToken(data.token);
  return data;
};

export const logout = () => {
  removeToken();
};
