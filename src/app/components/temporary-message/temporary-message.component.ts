import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {timer} from 'rxjs';

@Component({
  selector: 'app-temporary-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temporary-message.component.html',
  styleUrls: ['./temporary-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemporaryMessageComponent implements AfterViewInit {
  @Input() public message: string;
  @Input() public iconClass: string;

  public opacity: number;

  constructor(private _cdr: ChangeDetectorRef) {
    this.message = '';
    this.iconClass = '';
    this.opacity = 1;
  }

  ngAfterViewInit() {
    this._cdr.markForCheck();
    timer(4000).subscribe(() => {
      this.opacity = 0;
      this._cdr.markForCheck();
    })
  }
}
