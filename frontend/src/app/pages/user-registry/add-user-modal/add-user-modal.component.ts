import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup,  ValidatorFn,  Validators } from '@angular/forms';
import { UserRequest } from 'src/app/shared/models';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css'],
})
export class AddUserModalComponent implements OnInit {
  createUserForm: FormGroup;
  @Output() close = new EventEmitter<void>();
  @Output() createUser = new EventEmitter<UserRequest>();
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  admin: boolean | null;
  errorMessage: string | null = null;

  closeModal() {
    this.close.emit();
  }

  constructor() {
    this.admin = null;
    this.createUserForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]), 
      confirmPassword: new FormControl('', [Validators.required, this.passwordMatchValidator()]),

      admin: new FormControl('', [Validators.required])
    });
  }
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.root.get('password');
      const confirmPassword = control.value;
      if (password && password.value !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }
  
  ngOnInit(): void {}

  submitForm() {
    console.log('Form Submitted', this.createUserForm.value);
  
    if (this.createUserForm.valid) {
      this.errorMessage = null;
  
      const newUserData: UserRequest = {
        credentials: {
          username: this.createUserForm.value.email,
          password: this.createUserForm.value.password,
        },
        profile: {
          firstName: this.createUserForm.value.firstName,
          lastName: this.createUserForm.value.lastName,
          email: this.createUserForm.value.email,
          phone: this.createUserForm.value.phone,
        },
        admin: this.createUserForm.value.admin,
      };
      
      console.log('New User Data', newUserData);
  
      this.createUser.emit(newUserData);
      this.closeModal();
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    }
  }



}
