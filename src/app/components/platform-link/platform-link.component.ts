import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {PlatformLink} from '../../interfaces/user.interface';
import {PlatformsEnum} from '../../enums/platforms.enum';
import {platformIcons, platformNames} from '../../consts/platform-data';

@Component({
  selector: 'platform-link',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgIf
  ],
  templateUrl: './platform-link.component.html',
  styleUrl: './platform-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformLinkComponent implements OnInit {
  @Input() platformLink!: PlatformLink;

  public currentColor: string;
  public textColor: string;
  public currentIcon: string;
  public currentName: string;

  private _platformColors: { [key in PlatformsEnum]: string };

  constructor() {
    this.currentColor = '#EEEEEE';
    this.textColor = 'var(--white)';
    this.currentName = '';
    this.currentIcon = '';
    this._platformColors = this._initializePlatformColors();
  }

  ngOnInit() {
    this._initialize();
  }

  public redirectToLink(): void {
    if (this.platformLink?.link) {
      window.open(this.platformLink.link, '_blank');
    }
  }

  private _initializePlatformColors(): { [key in PlatformsEnum]: string } {
    return {
      [PlatformsEnum.GitHub]: '#1A1A1A',
      [PlatformsEnum.FrontendMentor]: '#FFFFFF',
      [PlatformsEnum.Twitter]: '#43B7E9',
      [PlatformsEnum.LinkedIn]: '#2D68FF',
      [PlatformsEnum.YouTube]: '#EE3939',
      [PlatformsEnum.Facebook]: '#2442AC',
      [PlatformsEnum.Twitch]: '#EE3FC8',
      [PlatformsEnum.DevTO]: '#333333',
      [PlatformsEnum.Codewars]: '#8A1A50',
      [PlatformsEnum.Codepen]: '#221220',
      [PlatformsEnum.FreeCodeCamp]: '#302267',
      [PlatformsEnum.GitLab]: '#EB4925',
      [PlatformsEnum.Hashnode]: '#0330D1',
      [PlatformsEnum.StackOverflow]: '#EC7100',
    };
  }

  private _initialize(): void {
    if (!!this.platformLink.platform) {
      this.currentColor = this._platformColors[this.platformLink.platform];
      this.currentName = platformNames[this.platformLink.platform];
      this.currentIcon = platformIcons[this.platformLink.platform];
      (this.platformLink.platform === PlatformsEnum.FrontendMentor) && (this.textColor = 'var(--dark-grey)');
    } else {
      this.currentColor = '#EEEEEE';
      this.currentName = '';
      this.currentIcon = '';
      this.textColor = '#EEEEEE'
    }
  }
}
