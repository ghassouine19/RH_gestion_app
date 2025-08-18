import {upDateData} from "./httpService";

const BASE = "http://localhost:8080/api";

export const updateUser = (data,id) => upDateData(`${BASE}/users/updateUser/${id}`,data);
export const updateDemande = (statut,id) => upDateData(`${BASE}/demandes/${id}/statut`, statut);
