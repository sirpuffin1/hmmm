import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import {
  createUser,
  loginUser,
  updateUser,
} from 'src/app/store/actions/user/user.actions';
import { User } from '../../../../../shared/models/user.model';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss'],
})
export class UserSignupComponent implements OnInit, OnChanges {
  addUser: FormGroup;
  @Input() selectedUser: User | null = null;
  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.addUser = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.selectedUser?.currentValue) {
      const user = changes?.selectedUser?.currentValue;
      this.addUser.get('name')?.setValue(user.name);
      this.addUser.get('email')?.setValue(user.email);
      this.addUser.updateValueAndValidity();
    }
  }

  postUser(selectedUser: User | null) {
    !selectedUser
      ? this.store.dispatch(createUser({ data: this.addUser.value }))
      : this.store.dispatch(
          updateUser({ data: { ...selectedUser, ...this.addUser.value } })
        );
    this.addUser.reset();
  }

  login() {
    this.store.dispatch(loginUser({ data: this.addUser.value }));
  }
}