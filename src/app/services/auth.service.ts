import {Injectable} from '@angular/core';
import {PlatformLink, User} from '../interfaces/user.interface';
import {defaultUsers} from '../consts/default-users';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _loggedInUser!: User | null;
  private _users: Map<string, User>;

  private readonly _localStorageUsersKey = 'users';
  private readonly _localStorageLoggedInUserKey = 'loggedInUser';

  constructor() {
    this._users = new Map<string, User>();
    this._loadUsers();
    this._restoreLoggedInUser();
  }

  public register(email: string, password: string): string {
    if (this._getUserByEmail(email)) {
      return 'Email already exists.';
    }
    const newUser: User = { email, password, platforms: [], userId: uuidv4() };
    this._addUser(newUser);
    return '';
  }

  public login(email: string, password: string): string {
    const user = this._getUserByEmail(email);
    if (user && user.password === password) {
      this._loggedInUser = user;
      this._saveLoggedInUser();
      return '';
    }
    return 'Invalid email or password.';
  }

  public getLoggedInUser(): User | null {
    return this._loggedInUser;
  }

  public logout(): void {
    this._loggedInUser = null;
    this._saveLoggedInUser();
  }

  public updateUserFirstName(firstName: string): void {
    const user = this._validateLoggedInUser();
    user.firstName = firstName;
    this._saveDataToLocalStorage();
  }

  public updateUserLastName(lastName: string): void {
    const user = this._validateLoggedInUser();
    user.lastName = lastName;
    this._saveDataToLocalStorage();
  }

  public updateUserEmail(email: string): void {
    const user = this._validateLoggedInUser();
    user.email = email;
    this._saveDataToLocalStorage();
  }

  public updateUserAvatarUrl(url: string): void {
    const user = this._validateLoggedInUser();
    user.imgUrl = url;
    this._saveDataToLocalStorage();
  }

  public updateUserLinks(links: PlatformLink[]): void {
    const user = this._validateLoggedInUser();
    user.platforms = links;
    this._saveDataToLocalStorage();
  }

  public getUser(userId: string): User | null {
    return this._users.get(userId) || null;
  }

  private _saveDataToLocalStorage(): void {
    this._saveUsersToLocalStorage();
    this._saveLoggedInUser();
  }

  private _saveLoggedInUser(): void {
    if (this._loggedInUser) {
      localStorage.setItem(this._localStorageLoggedInUserKey, JSON.stringify(this._loggedInUser));
    } else {
      localStorage.removeItem(this._localStorageLoggedInUserKey);
    }
  }

  private _addUser(user: User): void {
    this._users.set(user.userId, user);
    this._saveUsersToLocalStorage();
  }

  private _getUserByEmail(email: string): User | undefined {
    return Array.from(this._users.values()).find((user) => user.email === email);
  }

  private _loadUsers(): void {
    const usersData = localStorage.getItem(this._localStorageUsersKey);
    if (usersData) {
      const storedUsers: User[] = JSON.parse(usersData);
      this._users = new Map(storedUsers.map((user) => [user.userId, user]));
    } else {
      defaultUsers.forEach((user) => this._users.set(user.userId, user));
      this._saveUsersToLocalStorage();
    }
  }

  private _validateLoggedInUser(): User {
    if (!this._loggedInUser) {
      throw new Error('No user is logged in.');
    }
    return this._loggedInUser;
  }

  private _restoreLoggedInUser(): void {
    const userData = localStorage.getItem(this._localStorageLoggedInUserKey);

    if (userData) {
      const storedUser: User = JSON.parse(userData);
      console.info('storedUser', storedUser);

      this._users.set(storedUser.userId, storedUser);
      this._loggedInUser = storedUser;
    }
  }

  private _saveUsersToLocalStorage(): void {
    const usersArray = Array.from(this._users.values());
    localStorage.setItem(this._localStorageUsersKey, JSON.stringify(usersArray));
  }
}
