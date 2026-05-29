import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-my-contacts',
  standalone: true,
  imports: [],
  templateUrl: './my-contacts.component.html',
  styleUrl: './my-contacts.component.scss'
})
export class MyContactsComponent {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  focusSearch() {
    this.searchInput.nativeElement.focus();
  }
}
