import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagesComponent } from './config/components/messages/messages.component';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../app/config/config-service.service';
import { TypeMessage } from '../app/config/interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MessagesComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Whatsapp_Web_Front';

  constructor(
    private readonly configService: ConfigService,
  ){}

  disableMessage: boolean = true;
  textMessage: string = '';
  statusMessage: TypeMessage = 'SUCCESS';

  ngOnInit(): void {
    this.configService.getMessage().subscribe(status => {
      if(!status.disabled){
        this.disableMessage = false;
        this.textMessage = status.message;
        this.statusMessage = status.status;
      } else if(status.disabled) {
        this.disableMessage = true;
        this.textMessage = status.message;
        this.statusMessage = status.status;
      }
    })
  }
}
