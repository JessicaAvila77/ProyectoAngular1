import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductMsj, ProductResponse } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  API_URL = 'http://localhost:3000';

  constructor(
    private HttpClient:HttpClient
  ) { }

  //creando los metodos del crud

getProducts(){
  return this.HttpClient.get<Product[]>(this.API_URL+'/inventario')
}

getProduct(id: number){
  return this.HttpClient.get<ProductResponse>(this.API_URL+'/inventario/'+id)
}

saveProduct(product:Product){
  return this.HttpClient.post<ProductResponse>(this.API_URL+'/inventario',product)
}

getNextId(){
  return this.HttpClient.get<number>(this.API_URL+'/inventario-nextid')
}

deleteProduct(id:number){
  return this.HttpClient.delete(this.API_URL+"/inventario/"+id)
}

updateProduct(id:Number, product:Product){
  return this.HttpClient.put<ProductMsj>(`${this.API_URL}/inventario/${id}`, product)
}


}
