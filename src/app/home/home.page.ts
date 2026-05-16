import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomePage implements OnInit, OnDestroy {
  codename: string = '';
  latency: number = 12;
  showError: boolean = false;

  private latencyInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.latencyInterval = setInterval(() => {
      this.latency = Math.floor(Math.random() * (18 - 8 + 1)) + 8;
    }, 3000);
  }

  // --- TAMBAHKAN FUNGSI INI ---
  // Fungsi ini berjalan tepat sebelum halaman disembunyikan/pindah
  ionViewWillLeave() {
    // Memaksa elemen yang sedang aktif (tombol/input) untuk melepas fokus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
  

  ngOnDestroy() {
    if (this.latencyInterval) {
      clearInterval(this.latencyInterval);
    }
  }

  startSession() {
  const trimmed = this.codename.trim();
  if (!trimmed || trimmed.length < 3) {
    this.showError = true;
    return;
  }
  this.showError = false;
  
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  this.router.navigate(['/game'], {
    replaceUrl: true, 
    state: { codename: trimmed }
  });
  }
}