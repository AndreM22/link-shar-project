import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {PlatformLink} from '../../interfaces/user.interface';
import {PlatformsEnum} from '../../enums/platforms.enum';

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
  public currentIcon: string;
  public currentName: string;

  private _platformColors: { [key in PlatformsEnum]: string };
  private _platformIcons: { [key in PlatformsEnum]: string };
  private _platformNames: { [key in PlatformsEnum]: string };

  constructor() {
    this.currentColor = '#EEEEEE';
    this.currentName = '';
    this.currentIcon = '';
    this._platformColors = this._initializePlatformColors();
    this._platformIcons = this._initializePlatformIcon();
    this._platformNames = this._initializePlatformNames();
  }

  ngOnInit() {
    this._initialize();
  }

  public redirectToLink(): void {
    if (this.platformLink?.link) {
      window.open(this.platformLink.link, '_blank');
    }
  }

  private _initializePlatformNames(): { [key in PlatformsEnum]: string } {
    return {
      [PlatformsEnum.GitHub]: 'Github',
      [PlatformsEnum.FrontendMentor]: 'Frontend Mentor',
      [PlatformsEnum.Twitter]: 'Twitter',
      [PlatformsEnum.LinkedIn]: 'LinkedIn',
      [PlatformsEnum.YouTube]: 'YouTube',
      [PlatformsEnum.Facebook]: 'Facebook',
      [PlatformsEnum.Twitch]: 'Twitch',
      [PlatformsEnum.DevTO]: 'Dev.to',
      [PlatformsEnum.Codewars]: 'Codewars',
      [PlatformsEnum.Codepen]: 'Codepen',
      [PlatformsEnum.FreeCodeCamp]: 'freeCodeCamp',
      [PlatformsEnum.GitLab]: 'GitLab',
      [PlatformsEnum.Hashnode]: 'Hashnode',
      [PlatformsEnum.StackOverflow]: 'Stack Overflow',
    };
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

  private _initializePlatformIcon(): { [key in PlatformsEnum]: string } {
    return {
      [PlatformsEnum.GitHub]: 'icon-link-github',
      [PlatformsEnum.FrontendMentor]: 'icon-link-frontend-mentor',
      [PlatformsEnum.Twitter]: 'icon-link-twitter',
      [PlatformsEnum.LinkedIn]: 'icon-link-linked-in',
      [PlatformsEnum.YouTube]: 'icon-link-youtube',
      [PlatformsEnum.Facebook]: 'icon-link-facebook',
      [PlatformsEnum.Twitch]: 'icon-link-twitch',
      [PlatformsEnum.DevTO]: 'icon-link-devto',
      [PlatformsEnum.Codewars]: 'icon-link-codewars',
      [PlatformsEnum.Codepen]: 'icon-link-frontend-mentor',
      [PlatformsEnum.FreeCodeCamp]: 'icon-link-free-code-camp',
      [PlatformsEnum.GitLab]: 'icon-link-gitlab',
      [PlatformsEnum.Hashnode]: 'icon-link-hashnode',
      [PlatformsEnum.StackOverflow]: 'icon-link-stack-overflow',
    };
  }

  private _initialize(): void {
    if (!!this.platformLink) {
      this.currentColor = this._platformColors[this.platformLink.platform];
      this.currentName = this._platformNames[this.platformLink.platform];
      this.currentIcon = this._platformIcons[this.platformLink.platform];
    } else {
      this.currentColor = '#EEEEEE';
      this.currentName = '';
      this.currentIcon = '';
    }
  }
}
