import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ComponentFactoryResolver,
  createComponent,
  effect,
  Injector,
  OnInit, ViewContainerRef
} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {PlatformLink, User} from '../../../interfaces/user.interface';
import {EditPlatformLinkComponent} from '../../../components/edit-platform-link/edit-platform-link.component';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {PreviewLinksService} from '../../../services/preview-links.service';
import {PlatformsEnum} from '../../../enums/platforms.enum';
import {defaultUsers} from '../../../consts/default-users';
import {AuthService} from '../../../services/auth.service';
import {TemporaryMessageComponent} from '../../../components/temporary-message/temporary-message.component';
import {bootstrapApplication} from '@angular/platform-browser';
import {timer} from 'rxjs';

@Component({
  selector: 'app-edit-links',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    EditPlatformLinkComponent,
    NgForOf,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './edit-links.component.html',
  styleUrl: './edit-links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLinksComponent implements OnInit {
  public platformLinks: PlatformLink[];

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              private _previewLinksService: PreviewLinksService,
              private _viewContainerRef: ViewContainerRef,
              private _authService: AuthService,
              private _cdr: ChangeDetectorRef) {
    this.platformLinks = [];
    effect(() => this._listenPreviewLinksChanged(this._previewLinksService.getPreviewLinkSignal()()));
  }

  ngOnInit() {
    this._initialize();
  }

  public addLink(): void {
    const newLink: PlatformLink = {
      link: '',
      platform: PlatformsEnum.GitHub
    };
    this.platformLinks.push(newLink);
    const actualizedLinks = [...this.platformLinks];
    this._previewLinksService.setPreviewLinks(actualizedLinks);
  }

  public removeLink(i: number): void {
    if (i >= 0 && i < this.platformLinks.length) {
      this.platformLinks.splice(i, 1);
      this._setPreviewLinks();
    }
  }

  public drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.platformLinks, event.previousIndex, event.currentIndex);
    const actualizedLinks = [...this.platformLinks];
    this._previewLinksService.setPreviewLinks(actualizedLinks);
  }

  public onLinkChange(newLink: string, i: number) {
    if (i >= 0 && i < this.platformLinks.length) {
      this.platformLinks[i].link = newLink;
      this._setPreviewLinks();
    }
  }

  public onPlatformChange(newPlatform: PlatformsEnum, i: number) {
    if (i >= 0 && i < this.platformLinks.length) {
      const newPlatformLink = this.platformLinks[i];
      newPlatformLink.platform = newPlatform;
      this.platformLinks[i] = newPlatformLink;
      this._setPreviewLinks();
    }
  }

  public saveLinks() {
    this._authService.updateUserLinks(this.platformLinks);
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(TemporaryMessageComponent);
    const componentRef = this._viewContainerRef.createComponent(componentFactory);

    componentRef.instance.message = 'Your changes have been successfully saved!';
    timer(5000)
      .subscribe(() => componentRef.destroy())
  }

  private _setPreviewLinks(): void {
    const actualizedLinks = [...this.platformLinks];
    this._previewLinksService.setPreviewLinks(actualizedLinks);
    this._cdr.markForCheck();
  }

  private _listenPreviewLinksChanged(platformLinks: PlatformLink[]): void {
    this.platformLinks = platformLinks;
    this._cdr.markForCheck()
  }

  private _resetLinksPreview(): void {
    const loggedInUser: User | null = this._authService.getLoggedInUser();
    const defaultUser = defaultUsers.get('1');

    if (loggedInUser) {
      const actualizedLinks = [...loggedInUser.platforms];
      this._previewLinksService.setPreviewLinks(actualizedLinks);

    } else if (defaultUser) {
      const actualizedLinks = [...defaultUser.platforms];
      this._previewLinksService.setPreviewLinks(actualizedLinks);
    }
  }

  private _initialize(): void {
    this._resetLinksPreview();
  }
}
