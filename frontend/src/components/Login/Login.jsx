import React, { useState } from "react";
import "../../blocks/login.css";
import logo from "../../assets/Vector-logo.svg"
import { Link } from "react-router-dom";

function Login({ onSubmit }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        onSubmit(email, password);
    }

    return (
        <div className="login">
            <h1 className="login_sigup">Inicia Sesión</h1>
            <form className="login_form" onSubmit={handleSubmit}>
                <input
                    id="email"
                    type="email"
                    className="login_input"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    id="password"
                    type="password"
                    className="login_input"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login_button">
                    Iniciar Sesión
                </button>
                <span className="login_spam">
                    ¿Aún no eres miembro? <Link className="login_link" to="/signup">Regístrate aquí</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
