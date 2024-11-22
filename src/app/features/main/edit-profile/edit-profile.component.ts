import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subject, takeUntil, timer} from 'rxjs';
import {NgIf, NgStyle} from '@angular/common';
import {PreviewLinksService} from '../../../services/preview-links.service';
import {User} from '../../../interfaces/user.interface';
import {defaultUsers} from '../../../consts/default-users';
import {AuthService} from '../../../services/auth.service';
import {TemporaryMessageComponent} from '../../../components/temporary-message/temporary-message.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit, OnDestroy {
  public profileForm: FormGroup;
  public profilePicture: string | null = null;
  public submitted = false;
  private _unsubscribe = new Subject<void>();

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              private _previewLinksService: PreviewLinksService,
              private _viewContainerRef: ViewContainerRef,
              private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _cdr: ChangeDetectorRef) {
    this.profileForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this._initialize();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string;
        this._previewLinksService.setPreviewImg(this.profilePicture);
        this._cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    const formValues = this.profileForm.value;

    this._authService.updateUserFirstName(formValues.firstName);
    this._authService.updateUserLastName(formValues.lastName);
    this._authService.updateUserEmail(formValues.email);

    if (this.profilePicture) {
      this._authService.updateUserAvatarUrl(this.profilePicture);
    }

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(TemporaryMessageComponent);
    const componentRef = this._viewContainerRef.createComponent(componentFactory);

    componentRef.instance.message = 'Your changes have been successfully saved!';
    timer(5000)
      .subscribe(() => componentRef.destroy())
  }

  private _resetProfilePreview(): void {
    const loggedInUser: User | null = this._authService.getLoggedInUser();
    const defaultUser = defaultUsers.get('1');

    if (loggedInUser) {
      this._initPreview(loggedInUser);
    } else if (defaultUser) {
      this._initPreview(defaultUser);
    }
  }

  private _initPreview(user: User): void {
    this._previewLinksService.setPreviewEmail(user.email);
    user.firstName && this._previewLinksService.setPreviewFirstName(user.firstName);
    user.lastName && this._previewLinksService.setPreviewLastName(user.lastName);
    user.imgUrl && this._previewLinksService.setPreviewImg(user.imgUrl);
  }

  private _subscribeToFirstNameChanges(): void {
    this.profileForm.get('firstName')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribe)
      )
      .subscribe((value) => {
        this._previewLinksService.setPreviewFirstName(value);
      });
  }

  private _subscribeToLastNameChanges(): void {
    this.profileForm.get('lastName')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribe)
      )
      .subscribe((value) => {
        this._previewLinksService.setPreviewLastName(value);
      });
  }

  private _subscribeToEmailChanges(): void {
    this.profileForm.get('email')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribe)
      )
      .subscribe((value) => {
        this._previewLinksService.setPreviewEmail(value);
      });
  }

  private _resetSubmittedOnChanges(): void {
    this.profileForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => {
        this.submitted = false;
      });
  }

  private _initialize(): void {
    this._subscribeToFirstNameChanges();
    this._subscribeToLastNameChanges();
    this._subscribeToEmailChanges();
    this._resetSubmittedOnChanges();
    this._resetProfilePreview();
    this._setFormValues();
  }

  private _setFormValues(): void {
    const loggedInUser: User | null = this._authService.getLoggedInUser();

    if (loggedInUser) {
      this.profileForm.patchValue({
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email
      });
      this.profilePicture = loggedInUser.imgUrl || null;
    }
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
