import {PlatformsEnum} from '../enums/platforms.enum';

export interface User {
  userId: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  platforms: PlatformLink[];
  imgUrl?: string;
}

export interface PlatformLink {
  platform: PlatformsEnum;
  link: string;
}
