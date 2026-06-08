import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../config/config-service.service';
import { ProfileService } from '../../../profile/service/profile-service.service';
import { FriendShipService } from '../../services/friendship.service';
import { ProfileFormatted } from '../../interfaces';
import { AlterInfoProfileResponse } from '../../../profile/interfaces';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

  constructor(
      private readonly friendShipService: FriendShipService,
      private readonly configService: ConfigService,
    ) {}

    profilesList: ProfileFormatted[] = [];
  
    ngOnInit(): void {
      this.getProfileListForFriendShipFilterByStatus();
    }

    getProfileListForFriendShipFilterByStatus(){
      this.friendShipService.getProfileListForFriendShipFilterByStatus('PENDING').subscribe({
        next: (profiles) => {
          this.profilesList = profiles;
        }
      });
    }

    acceptFriendShip(username: string){
      this.friendShipService.approvedRequestFriendShip({ username }).subscribe({
        next: (response) => {
          this.configService.sendMessage({
              message: response.message, 
              status: 'SUCCESS',
              disabled: false,
              duration: 3000,
          });
          this.getProfileListForFriendShipFilterByStatus();
        }
      });
    }

    rejectFriendShip(username: string){
      this.friendShipService.rejectedRequestFriendShip({ username }).subscribe({
        next: (response) => {
          this.configService.sendMessage({
              message: response.message, 
              status: 'SUCCESS',
              disabled: false,
              duration: 3000,
          });
          this.getProfileListForFriendShipFilterByStatus();
        }
      });
    }

}
