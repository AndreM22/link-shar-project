import {User} from '../interfaces/user.interface';
import {PlatformsEnum} from '../enums/platforms.enum';

export const defaultUsers: Map<string, User> = new Map([
  ['1',
    {
      userId: '1',
      email: 'root@gmail.com',
      password: 'sesame12',
      platforms: [
        {platform: PlatformsEnum.GitHub, link: 'https://github.com/AndreM22'},
        {platform: PlatformsEnum.Twitter, link: 'https://twitter.com'},
        {platform: PlatformsEnum.YouTube, link: 'https://youtube.com'},
      ]
    }]
]);
