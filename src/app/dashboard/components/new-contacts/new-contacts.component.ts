import { Component, ViewChild, ElementRef } from '@angular/core';
import { FriendShipService } from '../../services/friendship.service';
import { ProfileFormatted } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { AlterInfoProfileResponse } from '../../../profile/interfaces';
import { ProfileService } from '../../../profile/service/profile-service.service';
import { ConfigService } from '../../../config/config-service.service';

@Component({
  selector: 'app-new-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-contacts.component.html',
  styleUrl: './new-contacts.component.scss'
})
export class NewContactsComponent {

  constructor(
    private readonly friendShipService: FriendShipService,
    private readonly profileService: ProfileService,
    private readonly configService: ConfigService,
  ) {
  }

  profilesList: ProfileFormatted[] = [];
  profilesListFilter: ProfileFormatted[] = [];
  profileInfo!: AlterInfoProfileResponse;
  filePhotoUser: string = '/user.png';
  filePhoto: string = this.filePhotoUser;

  ngOnInit(): void {
    this.getProfileListForFriendShip();

    this.profileService.getInfoProfile().subscribe({
      next: (profileInfo: AlterInfoProfileResponse) => {
        this.profileInfo = profileInfo;
        if(this.profileInfo.linkPhoto) {
          this.filePhoto = profileInfo.linkPhoto;
        }
      }
    });
  }

  getProfileListForFriendShip() {
    this.friendShipService.getProfileListForFriendShip().subscribe({
      next: (profiles) => {
        this.profilesList = profiles;
        this.profilesListFilter = profiles;
      }
    });
  }

  sendFriendshipRequest(recipientUsername: string){
    this.friendShipService.sendRequestFriendShip({ username: recipientUsername }).subscribe({
      next: (response) => {
        this.configService.sendMessage({
            message: response.message, 
            status: 'SUCCESS',
            disabled: false,
            duration: 3000,
        });
        this.getProfileListForFriendShip();
      }
    });
  }

  cancelRequestFriendship(recipientUsername: string){
    this.friendShipService.cancelRequestFriendship({ username: recipientUsername }).subscribe({
      next: (response) => {
        this.configService.sendMessage({
            message: response.message, 
            status: 'SUCCESS',
            disabled: false,
            duration: 3000,
        });
        this.getProfileListForFriendShip();
      }
    });
  }


  @ViewChild('searchInputText') searchInputText!: ElementRef<HTMLInputElement>;
  @ViewChild('searchInputPhone') searchInputPhone!: ElementRef<HTMLInputElement>;

  focusSearch() {
    this.searchInputText.nativeElement.focus();
  }

  searchProfiles(){
    const valueText = this.searchInputText.nativeElement.value ? this.searchInputText.nativeElement.value : '';
    const valuePhone = this.searchInputPhone.nativeElement.value ? this.searchInputPhone.nativeElement.value : '';
    if(!valueText && !valuePhone) {
      this.profilesListFilter = this.profilesList;
    } else if(valueText && !valuePhone) {
      this.profilesListFilter = this.profilesList.filter(profile => {
        const nameMatch = profile.name?.toLowerCase().includes(valueText.toLowerCase());
        return nameMatch;
      });
    } else if(!valueText && valuePhone) {
      this.profilesListFilter = this.profilesList.filter(profile => {
        const phoneMatch = profile.phone?.toLowerCase().includes(valuePhone.toLowerCase());
        return phoneMatch;
      });
    } else {
      this.profilesListFilter = this.profilesList.filter(profile => {
        const nameMatch = profile.name?.toLowerCase().includes(valueText.toLowerCase());
        const phoneMatch = profile.phone?.toLowerCase().includes(valuePhone.toLowerCase());
        return nameMatch && phoneMatch;
      });
    }
  }
}
