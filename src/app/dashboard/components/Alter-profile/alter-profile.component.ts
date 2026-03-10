import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alter-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './alter-profile.component.html',
  styleUrl: './alter-profile.component.scss'
})
export class AlterProfileComponent {
    @ViewChild('variableContainerAlterProfileInfoPhoto') variableContainerAlterProfileInfoPhoto!: ElementRef<HTMLButtonElement>;
  
    toggleContainerAlterProfileInfoPhoto() {
      this.variableContainerAlterProfileInfoPhoto
      .nativeElement.nextElementSibling!.classList.toggle('container-alter-profile-info-photo--view');
    }

    @ViewChild('variableInputName') variableInputName!: ElementRef<HTMLInputElement>;
    variableInputNameLength!: number;
    variableOpenEditName: boolean = false;

    @ViewChild('variableAlterNameBox') variableAlterNameBox!: ElementRef<HTMLDivElement>;

    inputNameFocus(){
      this.openEditName();
    }

    alterNameLength(){
      this.variableInputNameLength = 
      this.variableInputName.nativeElement.value.length ?
      this.variableInputName.nativeElement.value.length : 0;
    }

    openEditName(){
      this.variableOpenEditName = true;
      this.variableAlterNameBox.nativeElement.classList.add('container-alter-name_box--edit');
      this.variableInputName.nativeElement.focus();
      this.alterNameLength();
    }

    closeEditName(){
      this.variableOpenEditName = false;
      this.variableAlterNameBox.nativeElement.classList.remove('container-alter-name_box--edit');
    }

    insertEmojiName(emoji: string){
      this.variableInputName.nativeElement.value += emoji;
    }

}
