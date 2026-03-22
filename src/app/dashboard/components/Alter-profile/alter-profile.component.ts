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
  selector: 'app-alter-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './alter-profile.component.html',
  styleUrl: './alter-profile.component.scss'
})
export class AlterProfileComponent implements OnInit {
    constructor(
      private readonly emojiService: EmojiService,
      private readonly profileService: ProfileService,
    ) {}

    emojiAll!: Emoji[];
    emojiAllFilter!: Emoji[];
    profileInfo!: AlterInfoProfileResponse;
    filePhoto: string = '/user.png';

    form = new FormGroup({
      file: new FormControl<File | null>(null, [Validators.required]),
      name: new FormControl<string>('', [Validators.required]),
    });
    formLoader = false;

    ngOnInit(): void {
      this.emojiService.emojiAll().subscribe({
        next: (emojis) => {
          this.emojiAll = emojis;
          this.emojiAllFilter = this.emojiAll;
        }
      });

      this.profileService.getInfoProfile().subscribe({
        next: (profileInfo: AlterInfoProfileResponse) => {
          this.profileInfo = profileInfo;
          if(this.profileInfo.linkPhoto) {
            this.filePhoto = profileInfo.linkPhoto;
          }
          console.log(this.profileInfo);
          this.form.patchValue({name: this.profileInfo.name});
          this.form.get('name')?.updateValueAndValidity();
        }
      })
    };

    async alterProfile(){
      const values : Partial<{
          file: File | null;
          name: string | null;
      }> = this.form.value;
      console.log(values);
      let base64File = null;
      let mimeType = null
      if(values.file && values.file instanceof File) {
          const fileResponse = await this.fileToBase64(values.file);
          base64File = fileResponse.base64;
          mimeType = fileResponse.mimeType;
      }

      const body: AlterInfoProfileRequest = {
        base64File: base64File,
        mimeType: mimeType,
        name: values.name ? values.name : '',
        description: '',
        phone: '',
      }
  
      this.formLoader = true;
      this.profileService.alterInfoProfile(body)
      .pipe(
        finalize(() => { 
          this.formLoader = false;
        })
      )
      .subscribe({
        next: (response: StatusResponse) => {},
        error: (error) => {},
      });
    }

    fileToBase64(file: File): Promise<{ base64: string, mimeType: string }> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const base64String = reader.result.split(',')[1]; // Extrai a parte base64
            const mimeType = reader.result.split(';')[0].split(':')[1]; // Extrai o tipo MIME (image/jpeg, image/png, etc.)
            resolve({ base64: base64String, mimeType });
          } else {
            reject('Erro ao ler o arquivo');
          }
        };
    
        reader.onerror = (error) => {
          reject(error);
        };
    
        reader.readAsDataURL(file); // Lê o arquivo como DataURL
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
    @ViewChild('inputFilePhotoProfile') inputFilePhotoProfile!: ElementRef<HTMLInputElement>;
    @ViewChild('tagImgFileProfile') tagImgFileProfile!: ElementRef<HTMLElement>;

    alterFilePhoto(e: Event){
      const el = e.target as HTMLButtonElement;
      const inputFile = this.inputFilePhotoProfile.nativeElement as HTMLInputElement;
      inputFile.click();
    }

    handleFilePhoto(e: Event){
      const el = e.target as HTMLInputElement;
      const files = el.files;
      if(files && files.length > 0){
        // Essa URL:
        // existe apenas na memória do navegador
        // não existe no servidor
        // não pode ser acessada externamente
        // só funciona dentro da mesma página
        const url = URL.createObjectURL(files[0]);
        this.filePhoto = url;

        this.form.patchValue({
          file: files[0]
        });
        this.form.get('file')?.updateValueAndValidity();
      }
    }
  
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
      this.toggleBoxEmojis();
    }

    insertEmojiName(emoji: string){
      this.form.patchValue({name: this.profileInfo.name += emoji});
      this.form.get('name')?.updateValueAndValidity();
    }

    @ViewChild('variableContainerEmoji') variableContainerEmoji!: ElementRef<HTMLDivElement>;
    @ViewChild('containerAlterNameBoxEmojiBox') containerAlterNameBoxEmojiBox!: ElementRef<HTMLDivElement>;

    boxEmojiEventListener(e: Event){
        const el = e.target as HTMLDivElement;
        const childrens = Array.from(el.children) as HTMLDivElement[];
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

    buttonIconEmojiScroll(e: Event){
      const spanOnButton = e.target as HTMLButtonElement;

      const box = Array.from(this.containerAlterNameBoxEmojiBox.nativeElement.children) as HTMLDivElement[];
      box.forEach(element => {
        let valueType = element.classList[1].substring(11);
        if(spanOnButton.parentElement
          && spanOnButton.parentElement.getAttribute('varscroll') === 'SCHEDULE'){
          this.containerAlterNameBoxEmojiBox.nativeElement.scroll({
            top: 0,
            behavior: "smooth"
          });
        } else if(spanOnButton.parentElement
          && spanOnButton.parentElement.getAttribute('varscroll') === valueType){
          this.containerAlterNameBoxEmojiBox.nativeElement.scroll({
            top: element.offsetTop - 130,
            behavior: "smooth"
          });
        }
      });
    }

    toggleBoxEmojis(){
      this.variableContainerEmoji.nativeElement.classList.toggle('container-alter-name_box_emoji--view');
    }

}
