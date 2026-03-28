import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { buttonsActionsAlterComponents } from './interfaces';
import { ConversationsComponent } from './components/Conversations/conversations.component';
import { AlterProfileComponent } from "./components/Alter-profile/alter-profile.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, ConversationsComponent, AlterProfileComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  viewComponentNow: buttonsActionsAlterComponents = 'ALTER_PROFILE';

  viewComponentAlterProfile() {
    this.viewComponentNow = 'ALTER_PROFILE';
  }

  viewComponentConversations() {
    this.viewComponentNow = 'CONVERSATIONS';
  }


}
