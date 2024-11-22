import {Injectable} from '@angular/core';
import {PlatformLink, User} from '../interfaces/user.interface';
import {defaultUsers} from '../consts/default-users';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _loggedInUser: User | null;
  private _users: Map<string, User>;

  constructor() {
    this._loggedInUser = defaultUsers.get('1') || null;
    this._users = defaultUsers;
  }

  public register(email: string, password: string): string {
    for (let user of this._users.values()) {
      if (user.email === email) {
        return 'Email already exists.';
      }
    }

    const newUserId: string = uuidv4();
    const newUser: User = {email, password, platforms: [], userId: newUserId};
    this._users.set(newUserId, newUser);
    return '';
  }

  public login(email: string, password: string): string {
    for (let user of this._users.values()) {
      if (user.email === email && user.password === password) {
        this._loggedInUser = user;
        return '';
      }
    }
    return 'Invalid email or password.';
  }

  public getLoggedInUser(): User | null {
    return this._loggedInUser;
  }

  public logout(): void {
    this._loggedInUser = null;
  }

  public updateUserFirstName(firstName: string): void {
    this._loggedInUser!.firstName = firstName;
  }

  public updateUserLastName(lastName: string): void {
    this._loggedInUser!.lastName = lastName;
  }

  public updateUserEmail(email: string): void {
    this._loggedInUser!.email = email;
  }

  public updateUserAvatarUrl(url: string): void {
    this._loggedInUser!.imgUrl = url;
  }

  public updateUserLinks(links: PlatformLink[]): void {
    this._loggedInUser!.platforms = links;
  }
}
