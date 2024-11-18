import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy{
  public loginForm: FormGroup;
  public emailError: string | null;
  public passwordError: string | null;
  public submitted = false;

  private _unsubscribe: Subject<void>;

  constructor(
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _router: Router
  ) {
    this.emailError = null;
    this.passwordError = null;
    this._unsubscribe = new Subject<void>();

    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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

    this._router.navigate(['/main']);
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
      minlength: "Password must be at least 6 characters",
    };
    console.info('Lego')

    if (controls['email']?.errors) {
      const errorType = Object.keys(controls['email'].errors)[0];
      this.emailError = errorMessages[errorType] || 'Invalid email';
      console.info(this.emailError)
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
