export interface ApiRespone<T>{
    success: boolean
    message?: string
    data: T
}

export interface Error{
    message: string
}