import { postData } from "./httpService";

const BASE = "http://localhost:8080/api";

export const addDemande = (data) => postData(`${BASE}/demandes/add`,data);
export const addUser = (data) => postData(`${BASE}/users/addUser`,data);
export const uploadUserPhoto = (id, formData) => {
    return fetch(`${BASE}/users/${id}/photo`, {
        method: "POST",
        body: formData, // important : pas JSON
    }).then(res => res.json());
};
