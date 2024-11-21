import {PlatformsEnum} from '../enums/platforms.enum';

export const platformIcons: { [key in PlatformsEnum]: string } =
  {
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

export const platformNames: { [key in PlatformsEnum]: string } =
  {
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
