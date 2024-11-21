import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {defaultUsers} from '../../consts/default-users';
import {PlatformLinkComponent} from '../platform-link/platform-link.component';
import {PlatformLink} from '../../interfaces/user.interface';
import {NgForOf, NgIf} from '@angular/common';
import {PreviewLinksService} from '../../services/preview-links.service';
import {timer} from 'rxjs';

@Component({
  selector: 'cell-phone',
  standalone: true,
  imports: [
    PlatformLinkComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './cell-phone.component.html',
  styleUrl: './cell-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellPhoneComponent implements OnInit {
  public email: string;
  public name: string;
  public userPlatforms: PlatformLink[];

  constructor(private _previewLinksService: PreviewLinksService,
              private _authService: AuthService,
              private _cdr: ChangeDetectorRef) {
    this.email = '';
    this.name = '';
    this.userPlatforms = [];
    effect(() => this._updateLinkList(this._previewLinksService.getPreviewLinkSignal()()));
  }

  ngOnInit(): void {
    this._initialize();
  }

  private _updateLinkList(linkList: PlatformLink[]): void {
    if (linkList.length < 4) {
      this.userPlatforms = Array(4)
        .fill(null)
        .map((_, index) => linkList[index] || null);
    } else {
      this.userPlatforms = linkList;
    }
    this.userPlatforms = this.userPlatforms.map(item => ({ ...item }));

    this._cdr.markForCheck();
  }

  private _initialize(): void {
    const user = this._authService.getLoggedInUser() || defaultUsers[0];
    this.email = user.email.trim();
    this.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
}
