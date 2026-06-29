const ACCESS_TOKEN= "accessToken"

export const saveToken= (
    accessToken: string
)=>{
    localStorage.setItem(
        ACCESS_TOKEN,
        accessToken
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