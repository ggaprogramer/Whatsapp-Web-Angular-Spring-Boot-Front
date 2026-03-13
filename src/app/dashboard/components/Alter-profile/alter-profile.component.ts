import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmojiService } from '../../../config/emoji-service.service';
import { Emoji } from '../../../config/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alter-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './alter-profile.component.html',
  styleUrl: './alter-profile.component.scss'
})
export class AlterProfileComponent implements OnInit {
    constructor(
      private readonly emojiService: EmojiService,
    ) {}

    emojiAll!: Emoji[];
    emojiAllFilter!: Emoji[];

    ngOnInit(): void {
      this.emojiService.emojiAll().subscribe({
        next: (emojis) => {
          this.emojiAll = emojis;
          this.emojiAllFilter = this.emojiAll;
        }
      });
    }

    filterEmojis(e: Event){
      const inputSearch = e.target as HTMLInputElement;

      this.emojiAllFilter = [];
      if(inputSearch.value){
        for(let emojiObject of this.emojiAll){
          const emojiTemp: Emoji = {
            nameType: emojiObject.nameType,
            valueType: emojiObject.valueType,
            emojis: []
          };

          for(let emoji of emojiObject.emojis) {
            if(emoji.name.toLowerCase().indexOf(inputSearch.value.toLowerCase()) !== -1){
              emojiTemp.emojis.push({
                name: emoji.name,
                value: emoji.value
              })
            }
          }
          this.emojiAllFilter.push(emojiTemp);
        }
      } else {
        this.emojiAllFilter = this.emojiAll;
      }
    }

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

    @ViewChild('variableContainerEmoji') variableContainerEmoji!: ElementRef<HTMLDivElement>;
    @ViewChild('containerAlterNameBoxEmojiBox') containerAlterNameBoxEmojiBox!: ElementRef<HTMLDivElement>;
    @ViewChild('containerAlterNameBoxEmojiHeader') containerAlterNameBoxEmojiHeader!: ElementRef<HTMLDivElement>;
    toggleBoxEmojis(){
      this.variableContainerEmoji.nativeElement.classList.toggle('container-alter-name_box_emoji--view');

      if(this.variableContainerEmoji.nativeElement.classList.contains('container-alter-name_box_emoji--view')){
        const itemsBoxEmojis = Array.from(this.containerAlterNameBoxEmojiBox.nativeElement.children[0].children);
        const itemsIcons = Array.from(this.containerAlterNameBoxEmojiHeader.nativeElement.children);
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.forEach(_class => {
                if(_class.indexOf('var-scroll') !== -1){
                  let valueType = _class.substring(11);
                  itemsIcons.forEach(icon => {
                    if(icon.getAttribute('varscroll') === valueType){
                      icon.classList.add('container-alter-name_box_emoji_header_button--selected');
                    } else {
                      icon.classList.remove('container-alter-name_box_emoji_header_button--selected');
                    }
                  });
                }
              })
            }
          });
        }, {
          root: this.containerAlterNameBoxEmojiBox.nativeElement, // importante: container com scroll
          threshold: 0.2 // 10% visível
        });

        itemsBoxEmojis.forEach(item => observer.observe(item));
      }
    }

}
