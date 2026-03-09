import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.scss'
})
export class ConversationsComponent {

    @ViewChild('variableContainerConversationsHeaderOptions') variableContainerConversationsHeaderOptions!: ElementRef<HTMLButtonElement>;
    @ViewChild('variableContainerConversationHeaderActionsOptions') variableContainerConversationHeaderActionsOptions!: ElementRef<HTMLButtonElement>;
    @ViewChild('variableContainerConversationMessagesActionsAdd') variableContainerConversationMessagesActionsAdd!: ElementRef<HTMLButtonElement>;
  
    toggleContainerConversationsHeaderOptions() {
      this.variableContainerConversationHeaderActionsOptions
      .nativeElement.children[1]!.classList.remove('container-conversation_header_actions_options--view');
      this.variableContainerConversationMessagesActionsAdd
      .nativeElement.children[1]!.classList.remove('container-conversation_messages_actions_add--view');
  
      this.variableContainerConversationsHeaderOptions
      .nativeElement.children[1]!.classList.toggle('container-conversations_header_buttons_options--view');
    }
  
    toggleContainerConversationHeaderActionsOptions() {
      this.variableContainerConversationsHeaderOptions
      .nativeElement.children[1]!.classList.remove('container-conversations_header_buttons_options--view');
      this.variableContainerConversationMessagesActionsAdd
      .nativeElement.children[1]!.classList.remove('container-conversation_messages_actions_add--view');
  
      this.variableContainerConversationHeaderActionsOptions
      .nativeElement.children[1]!.classList.toggle('container-conversation_header_actions_options--view');
    }
  
    toggleContainerConversationMessagesActionsAdd() {
      this.variableContainerConversationsHeaderOptions
      .nativeElement.children[1]!.classList.remove('container-conversations_header_buttons_options--view');
      this.variableContainerConversationHeaderActionsOptions
      .nativeElement.children[1]!.classList.remove('container-conversation_header_actions_options--view');
  
      this.variableContainerConversationMessagesActionsAdd
      .nativeElement.children[1]!.classList.toggle('container-conversation_messages_actions_add--view');
    }

}
