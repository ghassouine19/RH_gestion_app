
const getToken = () => localStorage.getItem("token");

/*cette fonction compatible avec tout les operation de post*/
export const postData = async (url , data) =>{

    const token =getToken();

    const response = await fetch(url, {
        method : 'POST',
        headers :{
            'Content-Type' : 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body : JSON.stringify(data)
    });

    if(!response.ok) throw new Error(`Erreur API: ${response.status}`);

    return await response.json();
};

/*cette fonction compatible avec tout les operations de get*/
export const getData = async (url) =>{

    const token =getToken();

    const response = await fetch(url,{
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });

    if(!response.ok) throw new Error(`Erreur API: ${response.status}`);

    return await response.json();
}

/*cette fonction compatible avec tout les operations de delete*/
export const deleteData = async (url) =>{

    const token =getToken();

    const response = await fetch(url,{
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });

    if(!response.ok) throw new Error(`Erreur API: ${response.status}`);

    return await response.json();
}

/*cette fonction compatible avec tout les operations de update*/
export const upDateData = async (url,data) =>{

    const token =getToken();

    const response = await fetch(url,{
        method : 'PUT',
        headers : {
            'Content-Type' : 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body : JSON.stringify(data)
    });

    if(!response.ok) throw new Error(`Erreur API: ${response.status}`);

    return await response.json();
}



