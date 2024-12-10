export interface UserResponse{
    mensaje: string,
    usuario: User
}

export interface UserMsj{
    mensaje: string
    
}

export interface User{
    id: number,
    nombre: string,
    email: string,
    password: string,
    id_rol: string
}

