import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {
  public createAccountForm: FormGroup;
  public emailError: string | null;
  public passwordError: string | null;
  public confirmPasswordError: string | null;
  public submitted = false;

  private _unsubscribe: Subject<void>;

  constructor(private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _cdr: ChangeDetectorRef,
              private _router: Router) {
    this.emailError = null;
    this.passwordError = null;
    this.confirmPasswordError = null;
    this._unsubscribe = new Subject<void>();

    this.createAccountForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
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
    Object.values(this.createAccountForm.controls).forEach((control) => control.markAsTouched());

    if (this.createAccountForm.invalid) {
      this._setErrors();
      return;
    }

    const { email, password, confirmPassword } = this.createAccountForm.value;

    if (password !== confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      this._cdr.markForCheck();
      return;
    }

    const registrationError = this._authService.register(email, password);

    if (registrationError !== '') {
      this.emailError = registrationError;
      this._cdr.markForCheck();
      return;
    }

    const loginError = this._authService.login(email, password);

    if (loginError) {
      this.emailError = loginError;
      this._cdr.markForCheck();
      return;
    }

    this._router.navigate(['/main']);
  }

  private _resetErrors(): void {
    this.emailError = null;
    this.passwordError = null;
    this.confirmPasswordError = null;
    this._cdr.markForCheck();
  }

  private _setErrors(): void {
    const controls = this.createAccountForm.controls;
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

    if (controls['confirmPassword']?.errors) {
      const errorType = Object.keys(controls['confirmPassword'].errors)[0];
      this.confirmPasswordError = errorMessages[errorType] || 'Invalid confirmation password';
    }

    this._cdr.markForCheck();
  }

  private _initialize(): void {
    this.createAccountForm.valueChanges.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
      this._resetErrors();
      this._setErrors();
    });
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
