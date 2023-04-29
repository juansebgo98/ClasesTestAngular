import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { DirectivaComponent } from './Pages/directiva/directiva.component';
import { PaginatorComponent } from './Components/paginator/paginator.component'
import {HttpClientModule} from '@angular/common/http'
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { AlmacenamientoService } from './Services/almacenamiento.service';
import { InventarioService } from './Services/inventario.service';
import { ProductoService } from './Services/producto.service';
import { ProductListComponent } from './Pages/products-list/products-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ProductoInventoryComponent } from './Pages/producto-inventario/producto-inventario.component';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductoComponent } from './Pages/producto/producto.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';


import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatNativeDateModule } from '@angular/material/core';
import { InventarioDetailsComponent } from './Pages/inventario-details/inventario-details.component';





registerLocaleData(localeES,'es');

const routes: Routes = [
  { path: '', redirectTo:'/productos', pathMatch:'full'},
  { path: 'directivas', component: DirectivaComponent},
  { path: 'productos', component: ProductListComponent},
  { path: 'inventario/:id', component: ProductoInventoryComponent},
  { path: 'producto/:id', component: ProductoComponent},
  { path: 'producto', component: ProductoComponent},
  { path: 'crearInventario/:id', component: InventarioDetailsComponent }

]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    PaginatorComponent,
    ProductListComponent,
    ProductoInventoryComponent,
    ProductoComponent,
    InventarioDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    CommonModule, 
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgxScannerQrcodeModule,
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
    ],
  providers: [
    AlmacenamientoService,
    InventarioService,
    ProductoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
