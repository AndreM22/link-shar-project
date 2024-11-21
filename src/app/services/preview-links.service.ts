import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {PlatformLink} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class PreviewLinksService {

  private _previewLinksSignal: WritableSignal<PlatformLink[]>;

  constructor() {
    this._previewLinksSignal = signal<PlatformLink[]>([]);
  }

  public getPreviewLinkSignal():Signal<PlatformLink[]> {
    return computed(this._previewLinksSignal);
  }

  public setPreviewLinks(newLinks: PlatformLink[]) {
    this._previewLinksSignal.set(newLinks);
  }
}
