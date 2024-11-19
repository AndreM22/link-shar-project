import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CellPhoneComponent} from '../../components/cell-phone/cell-phone.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    NgClass,
    RouterOutlet,
    CellPhoneComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  constructor(private router: Router) {
  }
}
