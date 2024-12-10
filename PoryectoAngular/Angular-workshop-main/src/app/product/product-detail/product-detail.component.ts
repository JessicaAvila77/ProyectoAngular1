import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductResponse } from '../../models/product.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

  product: Product ={
    id:0,
    nombre:'',
    precio:0,
    cantidad:0
  }


  constructor(
    private productService: ProductService,
    private ActiveRouted: ActivatedRoute,
    private router:Router
  ){ }


  ngOnInit():void{
    let id = this.ActiveRouted.snapshot.paramMap.get('id') || '';

    this.productService.getProduct(parseInt(id)).subscribe((response:ProductResponse)=>{
      if(response.mensaje==='Ok'){
        this.product = response.producto
      }else{
        alert('Producto no encontrado')
      }

    })
  }

  regresar(): void {
    this.router.navigate(['/inventario']); 
  }
  

}


