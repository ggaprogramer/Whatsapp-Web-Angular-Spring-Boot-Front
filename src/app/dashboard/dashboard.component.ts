import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { buttonsActionsAlterComponents } from './interfaces';
import { ConversationsComponent } from './components/Conversations/conversations.component';
import { AlterProfileComponent } from "./components/Alter-profile/alter-profile.component";
import { NewContactsComponent } from './components/new-contacts/new-contacts.component';
import { MyContactsComponent } from './components/my-contacts/my-contacts.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, ConversationsComponent, 
    AlterProfileComponent, NewContactsComponent, MyContactsComponent, NotificationsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  viewComponentNow: buttonsActionsAlterComponents = 'NOTIFICATIONS';

  viewComponentAlterProfile() {
    this.viewComponentNow = 'ALTER_PROFILE';
  }

  viewComponentConversations() {
    this.viewComponentNow = 'CONVERSATIONS';
  }

  viewComponentNewContacts() {
    this.viewComponentNow = 'NEW_CONTACTS';
  }

  viewComponentMyContacts() {
    this.viewComponentNow = 'MY_CONTACTS';
  }

  viewComponentNotifications() {
    this.viewComponentNow = 'NOTIFICATIONS';
  }

}
