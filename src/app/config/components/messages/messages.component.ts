import { Component, Input } from '@angular/core';
import { TypeMessage } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  @Input({required: true}) status!: TypeMessage;
  @Input({required: true}) message!: string;

  classes = {
    'container-box-messages': true,
    'container-box-messages--success': true,
    'container-box-messages--error': false,
    'container-box-messages--info': false,
    'container-box-messages--warning': false,
  }

  ngOnInit(): void {
    this.classes = {
      ...this.classes,
      'container-box-messages--success': this.status == 'SUCCESS',
      'container-box-messages--error': this.status == 'ERROR',
      'container-box-messages--info': this.status == 'INFO',
      'container-box-messages--warning': this.status == 'WARNING',
    }
  }

}
