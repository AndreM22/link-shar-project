import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CellPhoneComponent} from '../../components/cell-phone/cell-phone.component';
import {PreviewLinksService} from '../../services/preview-links.service';
import {AuthService} from '../../services/auth.service';
import {defaultUsers} from '../../consts/default-users';

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
export class MainComponent implements OnInit {

  constructor(private _previewLinksService: PreviewLinksService,
              private _authService: AuthService,
              private router: Router) {

  }

  ngOnInit(): void {
    this._initialize();
  }

  private _initialize() {
    this._previewLinksService.setPreviewLinks((this._authService.getLoggedInUser() || defaultUsers[0]).platforms);
  }
}
