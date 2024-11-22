import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {PlatformLink} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class PreviewLinksService {

  private _previewLinksSignal: WritableSignal<PlatformLink[]>;
  private _previewFirstName: WritableSignal<string>;
  private _previewLastName: WritableSignal<string>;
  private _previewImg: WritableSignal<string>;
  private _previewEmail: WritableSignal<string>;

  constructor() {
    this._previewLinksSignal = signal<PlatformLink[]>([]);
    this._previewFirstName = signal<string>('');
    this._previewLastName = signal<string>('');
    this._previewImg = signal<string>('');
    this._previewEmail = signal<string>('');
  }

  public getPreviewLinkSignal(): Signal<PlatformLink[]> {
    return computed(this._previewLinksSignal);
  }

  public setPreviewLinks(newLinks: PlatformLink[]):void {
    this._previewLinksSignal.set(newLinks);
  }

  public getPreviewFirstNameSignal(): Signal<string> {
    return computed(this._previewFirstName);
  }

  public setPreviewFirstName(newFirstName: string):void {
    this._previewFirstName.set(newFirstName);
  }

  public getPreviewLastNameSignal(): Signal<string> {
    return computed(this._previewLastName);
  }

  public setPreviewLastName(newLastName: string):void {
    this._previewLastName.set(newLastName);
  }

  public getPreviewImgSignal(): Signal<string> {
    return computed(this._previewImg);
  }

  public setPreviewImg(newImg: string):void {
    this._previewImg.set(newImg);
  }

  public getPreviewEmailSignal(): Signal<string> {
    return computed(this._previewEmail);
  }

  public setPreviewEmail(newEmail: string): void {
    this._previewEmail.set(newEmail);
  }
}
