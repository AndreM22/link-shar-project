import {ChangeDetectionStrategy, Component, ComponentFactoryResolver, OnInit, ViewContainerRef} from '@angular/core';
import {PlatformLink, User} from '../../interfaces/user.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {TemporaryMessageComponent} from '../../components/temporary-message/temporary-message.component';
import {timer} from 'rxjs';
import {NgForOf, NgStyle} from '@angular/common';
import {PlatformLinkComponent} from '../../components/platform-link/platform-link.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    NgForOf,
    PlatformLinkComponent,
    NgStyle
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit {
  public user: User | null;
  public fullName: string;
  public userPlatforms: PlatformLink[];
  public avatarUrl: string | null;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              private _viewContainerRef: ViewContainerRef,
              private _activatedRoute: ActivatedRoute,
              private _authService: AuthService,
              private _router: Router) {
    this.user = null;
    this.fullName = '';
    this.userPlatforms = [];
    this.avatarUrl = null;
  }

  ngOnInit(): void {
    this._initialize();
  }

  public navigateToEditor(): void {
    this._router.navigate(['/main/edit-links']);
  }

  public copyCurrentLink(): void {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(TemporaryMessageComponent);
        const componentRef = this._viewContainerRef.createComponent(componentFactory);

        componentRef.instance.message = 'The link has been copied to your clipboard!';
        componentRef.instance.iconClass = 'icon-clip';
        timer(5000)
          .subscribe(() => componentRef.destroy())
      })
      .catch((err) => {
        console.error('Failed to copy the link: ', err);
      });
  }

  private _initialize(): void {
    const userId = this._activatedRoute.snapshot.paramMap.get('userId') ?? '1';
    if (userId) {
      this.user = this._authService.getUser(userId);
    }
    this.fullName = `${this.user?.firstName || ''} ${this.user?.lastName || ''}`.trim();
    this.userPlatforms = this.user?.platforms || [];
    this.avatarUrl = this.user?.imgUrl || null;
  }
}
