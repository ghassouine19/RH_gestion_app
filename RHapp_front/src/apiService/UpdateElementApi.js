import {upDateData, BASE_URL} from "./httpService";

export const updateUser = (id,data) => upDateData(`${BASE_URL}/users/updateUser/${id}`,data);
export const updateDemande = (statut,id) => upDateData(`${BASE_URL}/demandes/${id}/statut`, statut);

export const changePasswordApi = async (data, token) => {
    return fetch(`${BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
};

