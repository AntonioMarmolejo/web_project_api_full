import React, { useState } from "react";
import "../../blocks/register.css";
import logo from "../../assets/Vector-logo.svg"
import { Link } from "react-router-dom";

function Register({ onSubmit }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        onSubmit(email, password);
    }

    return (
        <div className="register">
            {/* <header className="register_header">
                <img className="register_logo" src={logo} alt="Logo-register" />
                <Link to="/signin" className="register_sigin">Iniciar Sesión</Link>
            </header> */}
            <h1 className="register_sigup">Registrate</h1>
            <form className="register_form" onSubmit={handleSubmit}>
                <input
                    id="email"
                    type="email"
                    className="register_input"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    id="password"
                    type="password"
                    className="register_input"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="register_button">
                    Registrarse
                </button>
                <span className="register_spam">
                    ¿Ya eres miembro? <Link className="register_link" to="/signin">Inicia sesión aquí</Link>
                </span>
            </form>
        </div>
    );
};

export default Register;
