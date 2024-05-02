const url = 'https://monitoringpersuratan-production.up.railway.app/api'
const GetmanagemenUser = async() => {
    const response = await fetch(url+'/users',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    });
    const json = await response.json();
    return json
}

export {GetmanagemenUser}