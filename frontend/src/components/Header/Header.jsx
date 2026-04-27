import logo from "../../images/Vector-logo.svg";
import { Link, useLocation } from "react-router-dom";
export default function Header({ email, onLogout, loggedIn }) {
    const location = useLocation();

    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Logo del Proyecto" />
            {loggedIn ? (
                <div className="header__user">
                    <p className="header__email">{email}</p>
                    <button className="header__logout" onClick={onLogout}>
                        Cerrar sesión
                    </button>
                </div>
            ) : (
                <nav className="header__nav">
                    {location.pathname === "/signup" && (
                        <Link to="/signin" className="header__link">Iniciar sesión</Link>
                    )}
                    {location.pathname === "/signin" && (
                        <Link to="/signup" className="header__link">Regístrate</Link>
                    )}
                </nav>
            )}
        </header>
    );
}
