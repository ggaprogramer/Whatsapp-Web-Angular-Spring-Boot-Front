import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
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

  @Input({ required: true }) formProfile!: FormGroup<{
      file: FormControl<File | null>;
      name: FormControl<string | null>;
      username: FormControl<string | null>;
      description: FormControl<string | null>;
      phone: FormControl<string | null>;
  }>
  @Input({ required: true }) emojiAll!: Emoji[];
  @Input({ required: true }) emojiAllFilter!: Emoji[];
  @Input({ required: true }) profileInfo!: AlterInfoProfileResponse;
  @Input({ required: true }) view: boolean = false;
  @Input({ required: true }) type!: string;

  classes = {
    'container-alter-field_box_emoji': true,
    'container-alter-field_box_emoji--view': this.view
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.classes = {
      ...this.classes,
      'container-alter-field_box_emoji--view': this.view
    }
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
  };

  insertEmojiField(emoji: string){
    if(this.type === 'name'){
      this.formProfile.patchValue({name: this.profileInfo.name += emoji});
      this.formProfile.markAsDirty();
      this.formProfile.get('name')?.updateValueAndValidity();
    } else if(this.type === 'description'){
      this.formProfile.patchValue({description: this.profileInfo.description += emoji});
      this.formProfile.markAsDirty();
      this.formProfile.get('description')?.updateValueAndValidity();
    }
  }

  @ViewChild('variableContainerEmoji') variableContainerEmoji!: ElementRef<HTMLDivElement>;
  @ViewChild('containerAlterFieldBoxEmojiBox') containerAlterFieldBoxEmojiBox!: ElementRef<HTMLDivElement>;

  boxEmojiEventListener(e: Event){
      const el = e.target as HTMLDivElement;
      const childrens = Array.from(el.children) as HTMLDivElement[];
      const itemsIcons = document.querySelectorAll('.container-alter-field_box_emoji_header_button') as NodeListOf<HTMLButtonElement>;

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
              icon.classList.add('container-alter-field_box_emoji_header_button--selected');
            } else {
              icon.classList.remove('container-alter-field_box_emoji_header_button--selected');
            }
          });
        };

    });
  }

  buttonIconEmojiScroll(e: Event){
    const spanOnButton = e.target as HTMLButtonElement;

    const box = Array.from(this.containerAlterFieldBoxEmojiBox.nativeElement.children) as HTMLDivElement[];
    box.forEach(element => {
      let valueType = element.classList[1].substring(11);
      if(spanOnButton.parentElement
        && spanOnButton.parentElement.getAttribute('varscroll') === 'SCHEDULE'){
        this.containerAlterFieldBoxEmojiBox.nativeElement.scroll({
          top: 0,
          behavior: "smooth"
        });
      } else if(spanOnButton.parentElement
        && spanOnButton.parentElement.getAttribute('varscroll') === valueType){
        this.containerAlterFieldBoxEmojiBox.nativeElement.scroll({
          top: element.offsetTop - 130,
          behavior: "smooth"
        });
      }
    });
  }
    
}
