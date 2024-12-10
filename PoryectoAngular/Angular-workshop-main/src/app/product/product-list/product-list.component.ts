import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  //corresponde a la interfaz
  products!:Product[]

  //inyecta dependencias, del servicio del componente donde estan los metodos, 
  //y el servicio para la navegacion y manejo de rutas
  constructor(
    private productService : ProductService,
    private router:Router

  ){}

  //lo primero es obtener la lista de productos
  ngOnInit(): void{
    this.productService.getProducts().subscribe((productsR:Product[]) => {
      this.products = productsR

    })

  }


  llevameAlDetalle(productId: number){
   this.router.navigate(['product-detail/',productId])
  }

  

  navegarProducto(){
    this.router.navigate(['product-create/'])

  }

 

  editarProducto(id: number): void {
    console.log('ID del producto:', id); 
    this.router.navigate(['product-edit/', id])

  }


  eliminarProducto(id: number){
    this.productService.deleteProduct(id).subscribe((res: any) => {
      console.log(res.mensaje)
      alert(`Producto con id ${id} eliminado`)
      this.productService.getProducts().subscribe((productsR: Product[]) => {
        this.products = productsR
      });
     
    })

  }

  regresar(){
    this.router.navigate(['/menu']);

  }


}


