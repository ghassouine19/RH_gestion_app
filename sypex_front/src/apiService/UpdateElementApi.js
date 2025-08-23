import {upDateData} from "./httpService";

const BASE = "http://localhost:8080/api";

export const updateUser = (id,data) => upDateData(`${BASE}/users/updateUser/${id}`,data);
export const updateDemande = (statut,id) => upDateData(`${BASE}/demandes/${id}/statut`, statut);

export const changePasswordApi = async (data, token) => {
    return fetch("http://localhost:8080/api/auth/change-password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
};

