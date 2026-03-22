import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmojiService } from '../../../config/emoji-service.service';
import { StatusResponse } from '../../../config/interfaces';
import { ProfileService } from '../../../profile/service/profile-service.service';
import { AlterInfoProfileRequest, AlterInfoProfileResponse } from '../../../profile/interfaces';
import { Emoji } from '../../../config/interfaces';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-emojis',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './emojis.component.html',
  styleUrl: './emojis.component.scss'
})
export class EmojisComponent {
    
}
