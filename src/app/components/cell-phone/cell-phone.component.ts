import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {defaultUsers} from '../../consts/default-users';
import {PlatformLinkComponent} from '../platform-link/platform-link.component';
import {PlatformLink} from '../../interfaces/user.interface';
import {NgForOf, NgIf} from '@angular/common';

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
export class CellPhoneComponent implements OnInit, OnDestroy {
  public email: string;
  public name: string;
  public platformLink!: PlatformLink;
  public userPlatforms: PlatformLink[];

  constructor(private _authService: AuthService,
              private _cdr: ChangeDetectorRef) {
    this.email = '';
    this.name = '';
    this.userPlatforms = [];
  }

  ngOnInit(): void {
    this._initialize();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  private _initialize(): void {
    const user = this._authService.getLoggedInUser() || defaultUsers[0];
    this.email = user.email.trim();
    this.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    this.platformLink = user.platforms[0];
    this.userPlatforms = Array(4)
      .fill(null)
      .map((_, index) => user.platforms[index] || null);
    this._cdr.markForCheck();
  }

  private _finalize(): void {
  }
}
