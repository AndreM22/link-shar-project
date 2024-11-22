import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CellPhoneComponent} from '../../components/cell-phone/cell-phone.component';
import {PreviewLinksService} from '../../services/preview-links.service';
import {AuthService} from '../../services/auth.service';
import {defaultUsers} from '../../consts/default-users';
import {User} from '../../interfaces/user.interface';

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
  public userId: string;

  constructor(private _previewLinksService: PreviewLinksService,
              private _authService: AuthService) {
    this.userId = '';
  }

  ngOnInit(): void {
    this._initialize();
  }

  private _initPreview(user: User): void {
    this._previewLinksService.setPreviewLinks(user.platforms);
    this._previewLinksService.setPreviewEmail(user.email);
    user.firstName && this._previewLinksService.setPreviewFirstName(user.firstName);
    user.lastName && this._previewLinksService.setPreviewLastName(user.lastName);
    user.imgUrl && this._previewLinksService.setPreviewImg(user.imgUrl);
  }

  private _initialize() {
    const loggedInUser: User | null = this._authService.getLoggedInUser();
    const defaultUser = defaultUsers.get('1');

    if (loggedInUser) {
      this._initPreview(loggedInUser);
      this.userId = loggedInUser.userId;
    } else if (defaultUser) {
      this._initPreview(defaultUser);
      this.userId = defaultUser.userId;
    }
  }
}
