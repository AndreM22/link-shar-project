import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {PlatformLink} from '../../../interfaces/user.interface';
import {EditPlatformLinkComponent} from '../../../components/edit-platform-link/edit-platform-link.component';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {PreviewLinksService} from '../../../services/preview-links.service';
import {PlatformsEnum} from '../../../enums/platforms.enum';

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
export class EditLinksComponent {
  public platformLinks: PlatformLink[];

  constructor(private _previewLinksService: PreviewLinksService,
              private _cdr: ChangeDetectorRef) {
    this.platformLinks = [];
    effect(() => this._listenPreviewLinksChanged(this._previewLinksService.getPreviewLinkSignal()()));
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
    console.info('CAMBIO')
    if (i >= 0 && i < this.platformLinks.length) {
      const newPlatformLink = this.platformLinks[i];
      newPlatformLink.platform = newPlatform;
      this.platformLinks[i] = newPlatformLink;
      this._setPreviewLinks();
    }
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
}
