import {deleteData} from "./httpService";

const BASE = "http://localhost:8080/api";

export const deleteUser = (id) => deleteData(`${BASE}/users/deleteUser/${id}`);