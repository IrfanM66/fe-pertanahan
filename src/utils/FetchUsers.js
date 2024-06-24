const url = "https://api.simdiskantahjember.com/api";

const Login = async(email,password) => {
    const response = await fetch(url+'/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    });
    const json = await response.json();
    return json
}

const GetProfile = async() => {
    try{
        const response = await fetch(url+'/profile',{
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        });
        const json = await response.json();
        return json
    }catch{
        return {status: false}
    }
}

export {Login, GetProfile}
