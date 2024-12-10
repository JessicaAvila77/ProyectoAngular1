import { Component, OnInit } from '@angular/core';
import { Product, ProductResponse } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {

  //2
  product: Product = {
    id: 0,
    nombre:'',
    precio:0,
    cantidad:0
  }
 
  //1
    constructor(
      private productService : ProductService,
      private route: ActivatedRoute,
      private router: Router

    ){}
//3
    ngOnInit(): void{
      //captura el id en una base decimal
      const productID = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

      if (productID){
        this.productService.getProduct(productID).subscribe((response:ProductResponse)=>{
          if(response.mensaje === 'Ok'){
            this.product = response.producto;
          }else{
            alert('Producto no encontrado');
            this.router.navigate(['inventario']);
          }
        });
      }
    }

    //4
    onSubmit(): void{
      console.log(this.product);
      this.productService.updateProduct(this.product.id, this.product).subscribe(
        (response) =>{
          console.log('Respuesta del servidor:', response);
          alert(response.mensaje);
          this.router.navigate(['inventario']);
        },
        (error)=>{
          console.error('Error al actualizar el producto:', error);
          alert('Error al guardar los cambios');
        }
        );

    };

}


