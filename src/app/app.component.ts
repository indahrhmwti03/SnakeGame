import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private location: Location 
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, async () => {
        
        // 1. Ambil path/rute halaman saat ini
        const currentPath = this.location.path();
        
        // 2. Buat daftar rute halaman yang akan memunculkan alert
        // Sesuaikan nama rutenya dengan yang ada di app-routing.module.ts Anda
        const exitPages = ['', '/home', '/game', '/over']; 

        // 3. Cek apakah halaman saat ini ada di dalam daftar exitPages
        if (exitPages.includes(currentPath)) {
          
          const alert = await this.alertController.create({
            header: 'Keluar Aplikasi',
            message: 'Apakah kamu yakin ingin keluar?',
            backdropDismiss: false, 
            buttons: [
              {
                text: 'Batal',
                role: 'cancel'
              },
              {
                text: 'Keluar',
                handler: () => {
                  App.exitApp();
                }
              }
            ]
          });
          await alert.present();

        } else {
          // Jika di halaman lain (misal halaman 'Settings' atau 'About'), 
          // tombol back hanya akan kembali ke halaman sebelumnya
          this.location.back();
        }

      });
    });
  }
}