import { getData } from "./httpService";

const BASE = "http://localhost:8080/api";

export const getAllUsers = () => getData(`${BASE}/users/all`);
export const getAllDemandes = () => getData(`${BASE}/demandes/all`);

export const getUserById = (id) => getData(`${BASE}/users/user/${id}`);
export const getDemandeById = (id) => getData(`${BASE}/demandes/demande/${id}`);

export const getDemandeByUserId = (id) => getData(`${BASE}/demandes/userDemande/${id}`)