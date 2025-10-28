import { getData,BASE_URL } from "./httpService";

const responsableId = localStorage.getItem("userId");


export const getAllUsers = () => getData(`${BASE_URL}/users/all`);
export const getAllDemandes = () => getData(`${BASE_URL}/demandes/all`);

export const getUserById = (id) => getData(`${BASE_URL}/users/user/${id}`);
export const getDemandeById = (id) => getData(`${BASE_URL}/demandes/demande/${id}`);

export const getDemandeByUserId = (id) => getData(`${BASE_URL}/demandes/userDemande/${id}`);

export const getDemandesForResponsable = (responsableId) => {
    if (!responsableId) return Promise.resolve([]);
    return getData(`${BASE_URL}/demandes/my-employees/${responsableId}`);
}

