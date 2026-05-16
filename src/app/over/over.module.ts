import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OverPage } from './over.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    OverPage, // Masukkan ke sini karena standalone
    RouterModule.forChild([{ path: '', component: OverPage }])
  ]
})
export class OverPageModule {}