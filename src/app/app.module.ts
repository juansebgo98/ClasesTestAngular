import { CommonModule, registerLocaleData } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FooterComponent } from "./Components/footer/footer.component";
import { HeaderComponent } from "./Components/header/header.component";
import { PaginatorComponent } from "./Components/paginator/paginator.component";
import { DirectivaComponent } from "./Pages/directiva/directiva.component";
import { InventarioDetailsComponent } from "./Pages/inventario-details/inventario-details.component";
import { ProductoInventoryComponent } from "./Pages/producto-inventario/producto-inventario.component";
import { ProductoComponent } from "./Pages/producto/producto.component";
import { ProductListComponent } from "./Pages/products-list/products-list.component";
import { AlmacenamientoService } from "./Services/almacenamiento.service";
import { InventarioService } from "./Services/inventario.service";
import { ProductoService } from "./Services/producto.service";
import { AppComponent } from "./app.component";

import localeES from '@angular/common/locales/es';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button'; // <-- importar MatButtonModule
import { MatCardModule } from '@angular/material/card'; // <-- importar MatCardModule
import { MatDatepickerModule } from '@angular/material/datepicker'; // <-- importar MatDatepickerModule
import { MatFormFieldModule } from '@angular/material/form-field'; // <-- importar MatFormFieldModule
import { MatIconModule } from '@angular/material/icon'; // <-- importar MatIconModule
import { MatInputModule } from '@angular/material/input'; // <-- importar MatInputModule
import { MatSelectModule } from '@angular/material/select'; // <-- importar MatSelectModule
import { NgxScannerQrcodeModule } from "ngx-scanner-qrcode";
import {MatDialogModule} from '@angular/material/dialog';
import { DialogMoverComponent } from './Components/dialog-mover/dialog-mover.component';



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
    InventarioDetailsComponent,
    DialogMoverComponent
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
    NgxScannerQrcodeModule,
    MatBadgeModule,
    MatDialogModule
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
