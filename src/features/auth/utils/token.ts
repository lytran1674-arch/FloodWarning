const ACCESS_TOKEN= "access_token"

export const saveToken= (
    token: string
)=>{
    localStorage.setItem(
        ACCESS_TOKEN,
        token
    )
}

export const getToken=()=>{
    return localStorage.getItem(ACCESS_TOKEN)
}

export const removeToken= ()=>{
    localStorage.removeItem(
    ACCESS_TOKEN
    )
}