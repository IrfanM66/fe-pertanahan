const url = "https://api.simdiskantahjember.com/api";

const GetManagemenUser = async() => {
    const response = await fetch(url+'/users',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    });
    const json = await response.json();
    return json
}
const GetDetailMnagemenUser = async(id) => {
    const response = await fetch(url+'/users/'+id,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    });
    const json = await response.json();
    return json
}
const DelManagemenUser = async(id) => {
    const response = await fetch(url+'/users/'+id,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    });
    const json = await response.json();
    return json
}
const PostManagemenUser = async(data) => {
    const response = await fetch(url+'/users',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json
}
const PutManagemenUser = async(id,data) => {
    const response = await fetch(url+'/users/'+id,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json
}
export {GetManagemenUser,GetDetailMnagemenUser,DelManagemenUser,PostManagemenUser,PutManagemenUser}
