import { NgModule } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import { DirectivaComponent } from "./Pages/directiva/directiva.component";
import { ProductListComponent } from "./Pages/products-list/products-list.component";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { AlmacenamientoService } from "./Services/almacenamiento.service";
import { InventarioService } from "./Services/inventario.service";
import { ProductoService } from "./Services/producto.service";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./Components/header/header.component";
import { FooterComponent } from "./Components/footer/footer.component";
import { PaginatorComponent } from "./Components/paginator/paginator.component";
import { ProductoInventoryComponent } from "./Pages/producto-inventario/producto-inventario.component";
import { ProductoComponent } from "./Pages/producto/producto.component";
import { InventarioDetailsComponent } from "./Pages/inventario-details/inventario-details.component";
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';

import { MatCardModule } from '@angular/material/card'; // <-- importar MatCardModule
import { MatButtonModule } from '@angular/material/button'; // <-- importar MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // <-- importar MatIconModule
import { MatFormFieldModule } from '@angular/material/form-field'; // <-- importar MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // <-- importar MatInputModule
import { MatSelectModule } from '@angular/material/select'; // <-- importar MatSelectModule
import { MatDatepickerModule } from '@angular/material/datepicker'; // <-- importar MatDatepickerModule
import localeES from '@angular/common/locales/es';
import { NgxScannerQrcodeModule } from "ngx-scanner-qrcode";



registerLocaleData(localeES, 'es');

const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'productos', component: ProductListComponent },
  { path: 'inventario/:id', component: ProductoInventoryComponent },
  { path: 'producto/:id', component: ProductoComponent },
  { path: 'producto', component: ProductoComponent },
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
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    NgxScannerQrcodeModule
  ],
  providers: [
    AlmacenamientoService,
    InventarioService,
    ProductoService,
    { provide: MAT_DATE_LOCALE, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
