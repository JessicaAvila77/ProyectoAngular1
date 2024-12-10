

export interface ProductResponse{
    mensaje: string,
    producto: Product
}

export interface ProductMsj{
    mensaje: string
    
}

export interface Product{
    id: number,
    nombre: string,
    precio: number,
    cantidad: number
}
