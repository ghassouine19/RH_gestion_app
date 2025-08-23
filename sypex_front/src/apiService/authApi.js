// src/apiService/authApi.js

// Fonction pour récupérer le JWT depuis le stockage
export const getToken = () => {
    return localStorage.getItem("token"); // ou sessionStorage.getItem("token")
};

// Fonction pour décoder le JWT (optionnel, simple parsing)
export const parseJwt = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erreur décodage JWT:", e);
        return null;
    }
};

// Récupère les infos de l'utilisateur connecté
export const getCurrentUser = async () => {
    const token = getToken();
    if (!token) throw new Error("Utilisateur non authentifié");

    // On peut directement décoder le JWT si le backend y met le rôle et l'id
    const decoded = parseJwt(token);
    if (!decoded) throw new Error("JWT invalide");

    return {
        id: decoded.id,       // attention : mettre le bon claim selon ton backend
        email: decoded.sub,   // ou decoded.email
        role: decoded.role,   // le rôle stocké dans le JWT
        nom: decoded.nom,     // si présent dans le JWT
        prenom: decoded.prenom
    };
};
