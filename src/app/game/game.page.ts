import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class GamePage implements AfterViewInit, OnDestroy {
  gridArray = new Array(400);
  score = 0;
  highScore = 0;

  isSettingsOpen = false;
  moveSpeed = 120;
  public isMusicOn: boolean = true;

  private eatSound!: HTMLAudioElement;
  private gameOverSound!: HTMLAudioElement;
  private soundsReady = false;

  private snake = [{ x: 10, y: 10 }];
  private food = { x: 5, y: 5 };
  private dx = 0;
  private dy = 0;
  private nextDx = 1;
  private nextDy = 0;
  private gameInterval: any;
  private isGameOver = false;

  private isRestart = false;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.isRestart = nav?.extras?.state?.['restart'] === true;

    this.initSounds();
    this.loadHighScore();
  }

  private loadHighScore() {
    const saved = localStorage.getItem('snake_highscore');
    this.highScore = saved ? parseInt(saved) : 0;
  }

  private saveHighScore() {
    localStorage.setItem('snake_highscore', this.highScore.toString());
  }

  private initSounds() {
    try {
      this.eatSound = new Audio('assets/sounds/eat.mp3');
      this.gameOverSound = new Audio('assets/sounds/gameover.mp3');

      this.eatSound.volume = 0.7;
      this.gameOverSound.volume = 1.0;

      this.eatSound.load();
      this.gameOverSound.load();

      this.eatSound.addEventListener('canplaythrough', () => {
        this.soundsReady = true;
      });

      this.eatSound.addEventListener('error', (e) => {
        console.error('❌ Gagal load eat.mp3', e);
      });

      this.gameOverSound.addEventListener('error', (e) => {
        console.error('❌ Gagal load gameover.mp3', e);
      });

    } catch (e) {
      console.error('Audio tidak didukung:', e);
    }
  }

  ngAfterViewInit() {
    this.startGame(true);
  }

  ngOnDestroy() {
    this.stopGameLoop();
    this.eatSound?.pause();
    this.gameOverSound?.pause();
  }

  private stopGameLoop() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  private playSFX(type: 'eat' | 'over') {
    if (!this.isMusicOn) return;
    const sound = type === 'eat' ? this.eatSound : this.gameOverSound;
    if (!sound) return;
    sound.pause();         // ← stop dulu sebelum play
    sound.currentTime = 0;
    sound.play().catch(e => console.warn('Audio play error:', e));
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
    if (!this.isSettingsOpen) {
      this.isGameOver = false; // ← reset flag saat settings ditutup
      this.startGame(false);
    } else {
      this.stopGameLoop();
    }
  }

  startGame(resetData: boolean = true) {
    this.isGameOver = false;
    if (resetData) {
      this.score = 0;
      this.snake = [{ x: 10, y: 10 }];
      this.nextDx = 1;
      this.nextDy = 0;
      this.spawnFood();
    }
    this.stopGameLoop();
    this.gameInterval = setInterval(() => this.update(), this.moveSpeed);
  }

  update() {
    if (this.isGameOver) return;

    this.dx = this.nextDx;
    this.dy = this.nextDy;

    let newX = this.snake[0].x + this.dx;
    let newY = this.snake[0].y + this.dy;

    if (newX >= 20) newX = 0;
    if (newX < 0) newX = 19;
    if (newY >= 20) newY = 0;
    if (newY < 0) newY = 19;

    const head = { x: newX, y: newY };

    if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
      this.handleGameOver();
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        this.saveHighScore();
      }
      this.playSFX('eat');
      this.spawnFood();
    } else {
      this.snake.pop();
    }
  }

  handleGameOver() {
    console.log('handleGameOver called, isGameOver:', this.isGameOver);
    if (this.isGameOver) return;
    this.isGameOver = true;

    this.stopGameLoop();
    this.playSFX('over');

    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
      this.router.navigate(['/over'], { state: { score: this.score } });
    }, 500);
  }

  changeDirection(dir: string) {
    if (dir === 'UP' && this.dy === 0)    { this.nextDx = 0;  this.nextDy = -1; }
    if (dir === 'DOWN' && this.dy === 0)  { this.nextDx = 0;  this.nextDy = 1;  }
    if (dir === 'LEFT' && this.dx === 0)  { this.nextDx = -1; this.nextDy = 0;  }
    if (dir === 'RIGHT' && this.dx === 0) { this.nextDx = 1;  this.nextDy = 0;  }
  }

  spawnFood() {
    this.food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };
    if (this.snake.some(s => s.x === this.food.x && s.y === this.food.y)) {
      this.spawnFood();
    }
  }

  goHome() {
    this.stopGameLoop();
    this.router.navigate(['/home']);
  }

  isSnake(index: number): boolean {
    const x = index % 20;
    const y = Math.floor(index / 20);
    return this.snake.some(s => s.x === x && s.y === y);
  }

  isFood(index: number): boolean {
    const x = index % 20;
    const y = Math.floor(index / 20);
    return this.food.x === x && this.food.y === y;
  }
}