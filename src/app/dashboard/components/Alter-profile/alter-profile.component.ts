import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
export class AlterProfileComponent implements OnInit, AfterViewInit, OnDestroy {
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

    ngAfterViewInit(): void {
      this.containerAlterNameBoxEmojiBox.nativeElement.addEventListener('scroll', this.boxEmojiEventListener);
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

    boxEmojiEventListener(e: Event){
        const el = e.target as HTMLDivElement;
        const childrens = Array.from(el.children[0].children) as HTMLDivElement[];
        const itemsIcons = document.querySelectorAll('.container-alter-name_box_emoji_header_button') as NodeListOf<HTMLButtonElement>;

        childrens.forEach(item => {

          const top = item.offsetTop;
          const bottom = top + item.offsetHeight;

          if (
            top < el.scrollTop + el.clientHeight &&
            bottom > el.scrollTop && itemsIcons &&
            item.classList[1].indexOf('var-scroll') !== -1
          ) {
            let valueType = item.classList[1].substring(11);
            itemsIcons.forEach(icon => {
              if(icon.getAttribute('varscroll') === valueType){
                icon.classList.add('container-alter-name_box_emoji_header_button--selected');
              } else {
                icon.classList.remove('container-alter-name_box_emoji_header_button--selected');
              }
            });
          };

      });
    }

    toggleBoxEmojis(){
      this.variableContainerEmoji.nativeElement.classList.toggle('container-alter-name_box_emoji--view');
    }


    ngOnDestroy(): void {
      this.containerAlterNameBoxEmojiBox.nativeElement.removeEventListener('scroll', this.boxEmojiEventListener);
    }

}
