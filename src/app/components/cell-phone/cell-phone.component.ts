import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {defaultUsers} from '../../consts/default-users';
import {PlatformLinkComponent} from '../platform-link/platform-link.component';
import {PlatformLink} from '../../interfaces/user.interface';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {PreviewLinksService} from '../../services/preview-links.service';
import {timer} from 'rxjs';

@Component({
  selector: 'cell-phone',
  standalone: true,
  imports: [
    PlatformLinkComponent,
    NgForOf,
    NgIf,
    NgStyle
  ],
  templateUrl: './cell-phone.component.html',
  styleUrl: './cell-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellPhoneComponent {
  public email: string;
  public firstName: string;
  public lastName: string;
  public userPlatforms: PlatformLink[];
  public avatarUrl: string | null;

  constructor(private _previewLinksService: PreviewLinksService,
              private _authService: AuthService,
              private _cdr: ChangeDetectorRef) {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.userPlatforms = [];
    this.avatarUrl = null;
    effect(() => this._updateLinkList(this._previewLinksService.getPreviewLinkSignal()()));
    effect(() => this._updateFirstName(this._previewLinksService.getPreviewFirstNameSignal()()));
    effect(() => this._updateLastName(this._previewLinksService.getPreviewLastNameSignal()()));
    effect(() => this._updateEmail(this._previewLinksService.getPreviewEmailSignal()()));
    effect(() => this._updateAvatarUrl(this._previewLinksService.getPreviewImgSignal()()));
  }

  private _updateLinkList(linkList: PlatformLink[]): void {
    if (linkList.length < 4) {
      this.userPlatforms = Array(4)
        .fill(null)
        .map((_, index) => linkList[index] || null);
    } else {
      this.userPlatforms = linkList;
    }
    this.userPlatforms = this.userPlatforms.map(item => ({...item}));

    this._cdr.markForCheck();
  }

  private _updateFirstName(firstName: string): void {
    this.firstName = firstName;
    this._cdr.markForCheck();
  }

  private _updateLastName(lastName: string): void {
    this.lastName = lastName;
    this._cdr.markForCheck();
  }

  private _updateEmail(email: string): void {
    this.email = email;
    this._cdr.markForCheck();
  }

  private _updateAvatarUrl(url: string): void {
    if (url) {
      this.avatarUrl = url;
    } else {
      this.avatarUrl = null;
    }
    this._cdr.markForCheck();
  }
}
