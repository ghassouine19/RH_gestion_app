import {deleteData,BASE_URL} from "./httpService";

export const deleteUser = (id) => deleteData(`${BASE_URL}/users/deleteUser/${id}`);