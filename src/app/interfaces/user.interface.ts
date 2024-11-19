import {PlatformsEnum} from '../enums/platforms.enum';

export interface User {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  platforms: PlatformLink[];
}

export interface PlatformLink {
  platform: PlatformsEnum;
  link: string;
}
