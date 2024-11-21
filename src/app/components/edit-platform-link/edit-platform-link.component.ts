import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {PlatformsEnum} from '../../enums/platforms.enum';
import {platformIcons, platformNames} from '../../consts/platform-data';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {PlatformLink} from '../../interfaces/user.interface';
import {debounceTime, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'edit-platform-link',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './edit-platform-link.component.html',
  styleUrl: './edit-platform-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPlatformLinkComponent implements OnInit, OnDestroy {
  @Input() public linkNumber: number;
  @Input() public platformLink!: PlatformLink;
  @Output() public remove: EventEmitter<void>;
  @Output() public linkChange: EventEmitter<string>;
  @Output() public platformChange: EventEmitter<PlatformsEnum>;

  public link: string;
  public platforms: PlatformsEnum[];
  public selectedPlatform: PlatformsEnum;
  public dropdownOpen: boolean;

  public readonly PLATFORM_ICONS: { [key in PlatformsEnum]: string } = platformIcons;
  public readonly PLATFORM_NAMES: { [key in PlatformsEnum]: string } = platformNames;

  private _linkChangeSubject: Subject<string>;
  private _unsubscribe: Subject<void>;

  constructor(private _cdr: ChangeDetectorRef) {
    this.linkNumber = 0;
    this.remove = new EventEmitter<void>();
    this.linkChange = new EventEmitter<string>();
    this.platformChange = new EventEmitter<PlatformsEnum>();
    this.link = '';
    this.platforms = [];
    this.selectedPlatform = PlatformsEnum.GitHub;
    this.dropdownOpen = false;
    this._linkChangeSubject = new Subject<string>();
    this._unsubscribe = new Subject<void>();
  }

  public ngOnInit() :void{
    this._initialize();
  }

  public ngOnDestroy() :void{
    this._finalize();
  }

  public onRemove() {
    this.remove.emit();
  }

  public toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this._cdr.markForCheck();
  }

  public selectPlatform(platform: PlatformsEnum): void {
    this.selectedPlatform = platform;
    this.dropdownOpen = false;
    this.platformChange.emit(platform);
    this._cdr.markForCheck();
  }

  public onInputChange(): void {
    this._linkChangeSubject.next(this.link);
  }

  private _initialize(): void {
    this.platforms = Object.values(PlatformsEnum);
    if (this.platformLink) {
      this.link = this.platformLink.link;
      this.selectedPlatform = this.platformLink.platform;
    }
    this._linkChangeSubject
      .pipe(
        debounceTime(300),
        takeUntil(this._unsubscribe))
      .subscribe((value: string) => {
        this.linkChange.emit(value);
      });
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
