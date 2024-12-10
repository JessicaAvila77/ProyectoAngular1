import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { ProductResponse } from '../../models/product.interface';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})

export class ProductCreateComponent implements OnInit{//llama a Oninit
  nextid =0
  form!: FormGroup

  constructor(//define las dependencias que este componentes necsita para funcionar
    private fb: FormBuilder,
    private productService: ProductService, //para interactuar con las api
    private router:Router //para navegar entre rtas

  ){}

  ngOnInit():void{
    this.form = this.fb.group({
      id:[0, [Validators.required]],
      nombre : ['', [Validators.required, Validators.minLength(3)]],
      precio:[0, [Validators.required]],
      cantidad:[0, [Validators.required]]

    })

    this.productService.getNextId().subscribe(nuevoId => this.nextid = nuevoId)

  }

  crearProducto(){
    if (this.form.invalid) {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
      // Muestra una alerta
     alert('Por favor, completa todos los campos requeridos.');
      return; // Detiene la ejecución del método
    }

    this.form.get('id')?.setValue(this.nextid)
    this.productService.saveProduct(this.form.value).subscribe((res: ProductResponse)=>{
      console.log(res.producto)
      this.router.navigate(['inventario'])//luego ed guardar se redirige a home
    })

  }


}
