import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, withInterceptors } from '@angular/common/http';
import { RouterModule, ROUTES } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { LoginComponent } from './pages/login/login.component';
import { authInterceptor } from './custon/auth.interceptor';
import { provideHttpClient } from '@angular/common/http';
import { ProductCreateComponent } from './product/product-create/product-create.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';



//declarar, importar y configurar todos los componentes, servicios, 
//y módulos que la aplicación necesita para funcionar.

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserDetailComponent,
    UserCreateComponent,
    UserEditComponent,
    LoginComponent,
    ProductCreateComponent,
    MenuComponent,
    ProductListComponent,
    ProductEditComponent,
    ProductDetailComponent,
  

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

  
  ],
  providers: [ // registrar servicios disponibles para toda la aplicación
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
