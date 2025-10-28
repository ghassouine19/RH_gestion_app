import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./loginForm.css";
import { BASE_URL } from "../../apiService/httpService";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Email ou mot de passe incorrect !");
            }

            const data = await response.json();

            localStorage.setItem("userId", data.id);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            // Redirection selon rôle
            if (data.role === "ADMIN") {
                navigate("/admin");
            } else if (data.role === "EMPLOYE") {
                navigate("/user");
            } else {
                navigate("/respo"); // Default page pour EMPLOYE
            }
        } catch (err) {
            console.error("Erreur login:", err);
            setError(err.message);
        }
    };

    return (
        <div className="lf-wrapper">
            <div className="lf-container">
                <Link to="/" className="lf-close">
                    <CloseIcon />
                </Link>
                <h2 className="lf-title">Connexion</h2>

                {error && <p className="lf-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="lf-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="lf-input"
                        placeholder="Entrez votre email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password" className="lf-label">Mot de passe</label>
                    <div className="lf-password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="lf-input"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span className="lf-eye" onClick={togglePasswordVisibility}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </span>
                    </div>

                    <button type="submit" className="lf-button">Se connecter</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
