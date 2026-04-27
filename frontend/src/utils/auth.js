import { setToken, getToken, removeToken } from './token';

const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

export const checkToken = async (token) => {
    const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Token inválido");
    return response.json(); // Devuelve {data: {email,}}
}

// Registrar un nuevo usuario
export const register = async (email, password) => {
    const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Error al registrar usuario");
    return response.json();
};

// Iniciar sesión
export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Correo o contraseña incorrectos");
    const data = await response.json();
    setToken(data.token); // Guardamos el token
    return data;
};

// Verificar si hay sesión activa


// Cerrar sesión
export const logout = () => {
    removeToken();
};