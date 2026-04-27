import React from "react";
import Popup from "../Main/components/Popup/Popup";
import successIcon from "../../images/success.svg";
import errorIcon from "../../images/error.svg";
import "../../blocks/infoTooltip.css";
export default function InfoTooltip({ isSuccess, message, onClose }) {
    return (
        <Popup isOpen={true} onClose={onClose}>
            <div className="info-tooltip">
                <img
                    src={isSuccess ? successIcon : errorIcon}
                    alt={isSuccess ? "Éxito" : "Error"}
                    className="info-tooltip__icon"
                />
                <p className="info-tooltip__message">{message}</p>
            </div>
        </Popup>
    );
}