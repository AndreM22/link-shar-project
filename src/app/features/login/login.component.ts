import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public emailError: string | null;
  public passwordError: string | null;
  public submitted = false;

  private _unsubscribe: Subject<void>;

  constructor(private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _cdr: ChangeDetectorRef,
              private _router: Router) {
    this.emailError = null;
    this.passwordError = null;
    this._unsubscribe = new Subject<void>();

    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  public ngOnInit(): void {
    this._initialize();
  }

  public ngOnDestroy(): void {
    this._finalize();
  }

  public onSubmit(): void {
    this.submitted = true;
    this._resetErrors();
    Object.values(this.loginForm.controls).forEach(control => control.markAsTouched());

    if (this.loginForm.invalid) {
      this._setErrors();
      return;
    }

    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;

    const loginError = this._authService.login(email, password);

    if (loginError !== '') {
      this._setAuthErrors(loginError);
    } else {
      this._router.navigate(['/main']);
    }
  }

  private _setAuthErrors(errorMessage: string): void {
    if (errorMessage.includes('Invalid')) {
      this.emailError = errorMessage;
      this.passwordError = errorMessage;
    } else {
      this.emailError = errorMessage;
    }
    this._cdr.markForCheck();
  }

  private _resetErrors(): void {
    this.emailError = null;
    this.passwordError = null;
    this._cdr.markForCheck();
  }

  private _setErrors(): void {
    const controls = this.loginForm.controls;
    const errorMessages: { [key: string]: string } = {
      required: "Can’t be empty",
      email: "Invalid email format",
      minlength: "Password must be at least 8 characters",
    };

    if (controls['email']?.errors) {
      const errorType = Object.keys(controls['email'].errors)[0];
      this.emailError = errorMessages[errorType] || 'Invalid email';
    }

    if (controls['password']?.errors) {
      const errorType = Object.keys(controls['password'].errors)[0];
      this.passwordError = errorMessages[errorType] || 'Invalid password';
    }

    this._cdr.markForCheck();
  }

  private _initialize(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => {
        this._resetErrors();
        this._setErrors();
      });
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
