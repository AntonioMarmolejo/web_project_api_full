import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Register from "./Register/Register";
import Login from "./Login/Login";
import InfoTooltip from "./infoTooltip/InfoTooltip";
import { logout, register, login, checkToken } from "../utils/auth";

export default function App() {
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [selectedCardToDelete, setSelectedCardToDelete] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    //estados que controlan el modal para personas que ya están o no registradas la página
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipSuccess, setTooltipSuccess] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            checkToken(token)
                .then((userData) => {
                    setCurrentUser(userData);
                    setLoggedIn(true);
                    api.getInitialCard().then(setCards).catch(console.error);
                })
                .catch((err) => {
                    console.error("Token inválido:", err);
                    logout();
                    navigate("/signin");
                });
        }
    }, []);

    const handleLogout = () => {
        logout();
        setCurrentUser({});
        setLoggedIn(false);
        navigate("/signin");
    }

    const handleLogin = () => {
        setLoggedIn(true);
        navigate("/");
    }

    const handleRegister = async (email, password) => {
        try {
            await register(email, password);
            handleShowTooltip(true, "¡Correcto! Ya estás registrado.");
            navigate("/signin");
        } catch (error) {
            handleShowTooltip(false, "Uy, algo salió mal. Por favor, inténtalo de nuevo.");
        }
    };

    const handleLoginSubmit = async (email, password) => {
        try {
            await login(email, password);
            handleLogin();
        } catch (error) {
            handleShowTooltip(false, "Correo o contraseña incorrectos.");
        }
    };

    //Función para contralar el boton, de reciclaje, al momento de darle click al ícono de basura
    function handleRecycleClick(card) {
        setSelectedCardToDelete(card);
        handleOpenPopup("deleteCard");
    }

    //Lógica de los likes y dislikes de cada tarjeta
    const handleCardLike = async (card) => {
        const isLiked = card.likes.some((user) => user._id === currentUser._id);
        const promise = isLiked ? api.deleteCardLink(card._id) : api.linkCard(card._id);

        try {
            const newCard = await promise;
            setCards((prevCards) => prevCards.map((c) => (c._id === card._id ? newCard : c)));
        } catch (error) {
            console.error("Error al manejar el like:", error);
        }
    };

    const handleAddPlaceSubmit = async (data) => {
        try {
            const newCard = await api.addCard(data.name, data.link);
            setCards([newCard, ...cards]); // Añadir la nueva tarjeta al inicio
            handleClosePopup();
        } catch (error) {
            console.error("Error al agregar la nueva tarjeta:", error);
        }
    };

    const handleCardDelete = async (evt) => {
        evt.preventDefault();
        try {
            await api.deleteCard(selectedCardToDelete._id);
            setCards((prevCards) => prevCards.filter((c) => c._id !== selectedCardToDelete._id));
            handleClosePopup();
        } catch (error) {
            console.error("Error al eliminar la tarjeta:", error);
        }
    };

    const handleOpenPopup = (type) => {
        setIsPopupOpen(true);
        setPopupType(type);
    };
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setPopupType(null);
        setSelectedCardToDelete(null);
    };


    const handleUpdateUser = async (data) => {
        try {
            const newDate = await api.updateUser(data.name, data.about);
            setCurrentUser(newDate); //Actualizar los datos del perifl de usuario en currentUser
        } catch (error) {
            console.error("Error al actualizar el usuario", error);
        }
    };

    async function handleUpdaterAvatar(data) {
        if (!data.avatar) {
            console.error("No se ha proporcionado una URL de avatar válida");
            return;
        }

        try {
            const updateUserAvatar = await api.updateUserPhoto(data.avatar); //Actulizar la imagen del ávatar
            setCurrentUser(updateUserAvatar);
            handleClosePopup();
        } catch (error) {
            console.error("Error al Actualizar el Avatar: " + error);
        }
    }

    const handleShowTooltip = (isSuccess, message) => {
        setTooltipSuccess(isSuccess);
        setTooltipMessage(message);
        setTooltipOpen(true);
    }

    return (
        <CurrentUserContext.Provider value={{ currentUser }}>
            <div className="page">
                <Header email={currentUser.email} onLogout={handleLogout} loggedIn={loggedIn} />
                <Routes>
                    <Route path="/signup" element={
                        <Register onSubmit={handleRegister} />
                    }
                    />

                    <Route path="/signin" element={
                        <Login onSubmit={handleLoginSubmit} />}
                    />
                    <Route path="*" element={<Navigate to="/signup" />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <main className="main">
                                <Main
                                    cards={cards}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleCardDelete}
                                    onAddPlaceSubmit={handleAddPlaceSubmit}
                                    onRecycleClick={handleRecycleClick}
                                    onOpenPopup={(type) => handleOpenPopup(type)}
                                    onClosePopup={() => handleClosePopup()}
                                    isPopupOpen={isPopupOpen}
                                    popupType={popupType}
                                    onUpdateAvatar={handleUpdaterAvatar}
                                    onUpdateUser={handleUpdateUser}
                                />
                                <Footer />
                            </main>
                        </ProtectedRoute>
                    } />
                </Routes>
                {tooltipOpen && (
                    <InfoTooltip
                        isSuccess={tooltipSuccess}
                        message={tooltipMessage}
                        onClose={() => setTooltipOpen(false)}
                    />
                )}
            </div>
        </CurrentUserContext.Provider>
    );
}
