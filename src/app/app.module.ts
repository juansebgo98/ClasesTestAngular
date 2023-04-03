import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { PaginatorComponent } from './paginator/paginator.component'
import {HttpClientModule} from '@angular/common/http'
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { AlmacenamientoService } from './models/Services/almacenamiento.service';
import { InventarioService } from './models/Services/inventario.service';
import { ProductoService } from './models/Services/producto.service';
import { ProductListComponent } from './products-list/products-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { InventoryComponent } from './producto-inventario/producto-inventario.component';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductoComponent } from './producto/producto.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';





registerLocaleData(localeES,'es');

const routes: Routes = [
  {path:'', redirectTo:'/productos', pathMatch:'full'},
  {path:'directivas', component: DirectivaComponent},
  {path:'productos', component: ProductListComponent},
  {path:'inventario/:id', component: InventoryComponent},
  {path:'producto/:id', component: ProductoComponent},
  {path:'producto', component: ProductoComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    PaginatorComponent,
    ProductListComponent,
    InventoryComponent,
    ProductoComponent
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
    NgbModule
  ],
  providers: [
    AlmacenamientoService,
    InventarioService,
    ProductoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
