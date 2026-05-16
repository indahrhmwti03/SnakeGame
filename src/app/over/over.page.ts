import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-over',
  templateUrl: './over.page.html',
  styleUrls: ['./over.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class OverPage {
  score: number = 0;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.score = navigation.extras.state['score'];
    }
  }

  restartGame() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/game'], {
        state: { restart: true }
      });
    });
  }

  goToMenu() {
    this.router.navigate(['/home']);
  }
}