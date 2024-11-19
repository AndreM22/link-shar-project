import {Injectable} from '@angular/core';
import {User} from '../interfaces/user.interface';
import {defaultUsers} from '../consts/default-users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _loggedInUser: User | null;
  private _users: User[] = [];

  constructor() {
    this._loggedInUser = null;
    this._users = [...defaultUsers];
  }

  public register(email: string, password: string): string {
    if (this._users.some(user => user.email === email)) {
      return 'Email already exists.';
    }
    const newUser: User = {email, password, platforms: []};
    this._users.push(newUser);
    return '';
  }

  public login(email: string, password: string): string {
    const user = this._users.find(user => user.email === email && user.password === password);
    if (!user) {
      return 'Invalid email or password.';
    }
    this._loggedInUser = user;
    return '';
  }

  public getLoggedInUser(): User | null {
    return this._loggedInUser;
  }

  public logout(): void {
    this._loggedInUser = null;
  }
}
