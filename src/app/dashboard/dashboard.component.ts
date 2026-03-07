import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  @ViewChild('variableContainerConversationsHeaderOptions') variableContainerConversationsHeaderOptions!: ElementRef<HTMLButtonElement>;
  @ViewChild('variableContainerConversationHeaderActionsOptions') variableContainerConversationHeaderActionsOptions!: ElementRef<HTMLButtonElement>;
  @ViewChild('variableContainerConversationMessagesActionsAdd') variableContainerConversationMessagesActionsAdd!: ElementRef<HTMLButtonElement>;

  toggleContainerConversationsHeaderOptions() {
    this.variableContainerConversationsHeaderOptions
    .nativeElement.children[1]!.classList.toggle('container-conversations_header_buttons_options--view');
  }

  toggleContainerConversationHeaderActionsOptions() {
    this.variableContainerConversationHeaderActionsOptions
    .nativeElement.children[1]!.classList.toggle('container-conversation_header_actions_options--view');
  }

  toggleContainerConversationMessagesActionsAdd() {
    this.variableContainerConversationMessagesActionsAdd
    .nativeElement.children[1]!.classList.toggle('container-conversation_messages_actions_add--view');
  }
}
