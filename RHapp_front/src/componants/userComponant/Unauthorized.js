import { Link } from "react-router-dom";
import "./unauthorized.css";

export default function Unauthorized() {
    return (
        <div className="unauth-container">
            <div className="unauth-card">
                <h1 className="unauth-code">403</h1>
                <h2 className="unauth-title">Accès refusé</h2>
                <p className="unauth-text">
                    Désolé, vous n’avez pas la permission d’accéder à cette page.
                </p>
                <Link to="/user" className="unauth-button">
                    Retour à l’accueil
                </Link>
            </div>
        </div>
    );
}

