import { Component, ViewChild, ElementRef } from '@angular/core';
import { FriendShipService } from '../../services/friendship.service';
import { ProfileFormatted } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-contacts.component.html',
  styleUrl: './new-contacts.component.scss'
})
export class NewContactsComponent {

  constructor(
    private readonly friendShipService: FriendShipService) {
  }

  profilesList: ProfileFormatted[] = [];

  ngOnInit(): void {
      this.friendShipService.getProfileListForFriendShip().subscribe({
        next: (profiles) => {
          this.profilesList = profiles;
          console.log(this.profilesList);
        }
      });
    }


  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  focusSearch() {
    this.searchInput.nativeElement.focus();
  }
}
