import { postData,BASE_URL } from "./httpService";

export const addDemande = (data) => postData(`${BASE_URL}/demandes/add`,data);
export const addUser = (data) => postData(`${BASE_URL}/users/addUser`,data);
export const uploadUserPhoto = (id, formData) => {
    return fetch(`${BASE_URL}/users/${id}/photo`, {
        method: "POST",
        body: formData, // important : pas JSON
    }).then(res => res.json());
};
