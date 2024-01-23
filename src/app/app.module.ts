import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { BREschemaComponent } from './breschema/breschema.component';
import { TabslistComponent } from './components/tabslist/tabslist.component';
import { TabsdetailComponent } from './components/tabsdetail/tabsdetail.component';


@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    BREschemaComponent,
    TabslistComponent,
    TabsdetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule, 
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
