import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { EmojiService } from '../../../config/emoji-service.service';
import { StatusResponse } from '../../../config/interfaces';
import { ProfileService } from '../../../profile/service/profile-service.service';
import { AlterInfoProfileRequest, AlterInfoProfileResponse } from '../../../profile/interfaces';
import { Emoji } from '../../../config/interfaces';
import { of, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { EmojisComponent } from '../Emojis/emojis.component';
import { ConfigService } from '../../../config/config-service.service';

@Component({
  selector: 'app-alter-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule, EmojisComponent],
  templateUrl: './alter-profile.component.html',
  styleUrl: './alter-profile.component.scss'
})
export class AlterProfileComponent implements OnInit {
    constructor(
      private readonly emojiService: EmojiService,
      private readonly profileService: ProfileService,
      private readonly configService: ConfigService,
      private readonly router: Router,
    ) {}

    emojiAll!: Emoji[];
    emojiAllFilter!: Emoji[];
    profileInfo!: AlterInfoProfileResponse;
    filePhotoUser: string = '/user.png';
    filePhoto: string = this.filePhotoUser;

    form = new FormGroup({
      file: new FormControl<File | null>(null),
      name: new FormControl<string>('', [Validators.required, Validators.maxLength(255)]),
      username: new FormControl<string>('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      description: new FormControl<string>('', [Validators.required]),
      phone: new FormControl<string>('', [Validators.required, 
        Validators.pattern(/^\(\d{2}\)\s9\d{4}-\d{4}$/)]),
    });
    formButtonDisabled: boolean = false;
    viewEmojis: Record<string, boolean> = {
      name: false,
      username: false,
      description: false,
      phone: false,
    }
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
          this.form.patchValue({name: this.profileInfo.name});
          this.form.get('name')?.updateValueAndValidity();
          this.form.patchValue({username: this.profileInfo.username});
          this.form.get('username')?.updateValueAndValidity();
          this.form.patchValue({description: this.profileInfo.description});
          this.form.get('description')?.updateValueAndValidity();
          this.form.patchValue({phone: this.profileInfo.phone});
          this.form.get('phone')?.updateValueAndValidity();
        }
      });
    };

    async alterProfile(){
      const values : Partial<{
          file: File | null;
          name: string | null;
          username: string | null;
          description: string | null;
          phone: string | null;
      }> = this.form.value;
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
        username: values.username ? values.username : '',
        description: values.description ? values.description : '',
        phone: values.phone ? values.phone : '',
      }
  
      this.formLoader = true;
      this.profileService.alterInfoProfile(body)
      .pipe(
        finalize(() => {
          this.formLoader = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.configService.sendMessage({
            message: 'O perfil foi atualizado com sucesso.', 
            status: 'SUCCESS',
            disabled: false,
            duration: 3000,
          });
        }, 
        error: (error) => {
          let errors = this.form.errors;
          const responseBody = error.error;
          if(responseBody.type == 'username'){
            this.form.get('username')!.setErrors({
              'username': responseBody.message
            }); 
          } else if(responseBody.type == 'system') {
            this.form.setErrors({
              ...errors,
              system: responseBody.message
            }); 
          }

          this.configService.sendMessage({
            message: responseBody.message, 
            status: 'ERROR',
            disabled: false,
            duration: 3000,
          });
        }
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

    @ViewChild('variableContainerAlterProfileInfoPhoto') variableContainerAlterProfileInfoPhoto!: ElementRef<HTMLButtonElement>;
    @ViewChild('inputFilePhotoProfile') inputFilePhotoProfile!: ElementRef<HTMLInputElement>;
    @ViewChild('tagImgFileProfile') tagImgFileProfile!: ElementRef<HTMLElement>;

    alterFilePhoto(e: Event){
      const el = e.target as HTMLButtonElement;
      const inputFile = this.inputFilePhotoProfile.nativeElement as HTMLInputElement;
      inputFile.click();
    }

    viewInfo(){
      const inputFile = this.inputFilePhotoProfile.nativeElement as HTMLInputElement;
      console.log(inputFile.value);
    }

    handleFilePhoto(e: Event){
      const el = e.target as HTMLInputElement;
      const files = el.files;
      console.log(files);
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
        this.form.updateValueAndValidity();
        this.form.markAsDirty();
      }
    }

    removePhoto(){
      const inputFile = this.inputFilePhotoProfile.nativeElement as HTMLInputElement;
      inputFile.value = '';

      this.form.patchValue({
          file: null
      });
      this.filePhoto = this.filePhotoUser;
      this.form.updateValueAndValidity();
    }

    viewPhoto(){
      if(this.filePhoto != this.filePhotoUser){
        window.open(this.filePhoto, '_blank');
      }
    }
  
    toggleContainerAlterProfileInfoPhoto() {
      this.variableContainerAlterProfileInfoPhoto
      .nativeElement.nextElementSibling!.classList.toggle('container-alter-profile-info-photo--view');
    }

    // Field Name - Start
    @ViewChild('variableInputName') variableInputName!: ElementRef<HTMLInputElement>;
    variableInputNameLength!: number;
    variableOpenEditName: boolean = false;
    @ViewChild('variableAlterNameBox') variableAlterNameBox!: ElementRef<HTMLDivElement>;
    // Field Name - End

    // Field Name - Start
    @ViewChild('variableInputUserName') variableInputUserName!: ElementRef<HTMLInputElement>;
    variableInputUserNameLength!: number;
    variableOpenEditUserName: boolean = false;
    @ViewChild('variableAlterUserNameBox') variableAlterUserNameBox!: ElementRef<HTMLDivElement>;
    // Field Name - End

    // Field Description - Start
    @ViewChild('variableInputDescription') variableInputDescription!: ElementRef<HTMLInputElement>;
    variableInputDescriptionLength!: number;
    variableOpenEditDescription: boolean = false;
    @ViewChild('variableAlterDescriptionBox') variableAlterDescriptionBox!: ElementRef<HTMLDivElement>;
    // Field Description - End

    // Field Description - Start
    @ViewChild('variableInputPhone') variableInputPhone!: ElementRef<HTMLInputElement>;
    variableInputPhoneLength!: number;
    variableOpenEditPhone: boolean = false;
    @ViewChild('variableAlterPhoneBox') variableAlterPhoneBox!: ElementRef<HTMLDivElement>;
    // Field Description - End

    inputFieldFocus(type: string){
      this.openEditField(type);
    }

    copyPhone() {
      const phone = this.form.get('phone')!.value;
      if(phone) {
        navigator.clipboard.writeText(phone);
        this.configService.sendMessage({
          message: 'Número copiado', 
          status: 'INFO',
          disabled: false,
          duration: 3000,
        });
      }
    }

    alterFieldLength(type: string){
      if(type === 'name'){
        this.variableInputNameLength = 
        this.variableInputName.nativeElement.value.length ?
        this.variableInputName.nativeElement.value.length : 0;
      } else if(type === 'username'){
        this.variableInputUserNameLength = 
        this.variableInputUserName.nativeElement.value.length ?
        this.variableInputUserName.nativeElement.value.length : 0;
      } else if(type === 'description'){
        this.variableInputDescriptionLength = 
        this.variableInputDescription.nativeElement.value.length ?
        this.variableInputDescription.nativeElement.value.length : 0;
      } else if(type === 'phone'){
        this.variableInputPhoneLength = 
        this.variableInputPhone.nativeElement.value.length ?
        this.variableInputPhone.nativeElement.value.length : 0;
      }
    }

    openEditField(type: string){
      if(type === 'name'){
        this.variableOpenEditName = true;
        this.variableAlterNameBox.nativeElement.classList.add('container-alter-field_box--edit');
        this.variableInputName.nativeElement.focus();
      } else if(type === 'username'){
        this.variableOpenEditUserName = true;
        this.variableAlterUserNameBox.nativeElement.classList.add('container-alter-field_box--edit');
        this.variableInputUserName.nativeElement.focus();
      } else if(type === 'description'){
        this.variableOpenEditDescription = true;
        this.variableAlterDescriptionBox.nativeElement.classList.add('container-alter-field_box--edit');
        this.variableInputDescription.nativeElement.focus();
      } else if(type === 'phone'){
        this.variableOpenEditPhone = true;
        this.variableAlterPhoneBox.nativeElement.classList.add('container-alter-field_box--edit');
        this.variableInputPhone.nativeElement.focus();
      }

      this.alterFieldLength(type);
      this.disabledButtonForm();
    }

    closeEditField(type: string){
      if(type === 'name'){
        this.variableOpenEditName = false;
        this.variableAlterNameBox.nativeElement.classList.remove('container-alter-field_box--edit');
      } else if(type === 'username'){
        this.variableOpenEditUserName = false;
        this.variableAlterUserNameBox.nativeElement.classList.remove('container-alter-field_box--edit');
      } else if(type === 'description'){
        this.variableOpenEditDescription = false;
        this.variableAlterDescriptionBox.nativeElement.classList.remove('container-alter-field_box--edit');
      } else if(type === 'phone'){
        this.variableOpenEditPhone = false;
        this.variableAlterPhoneBox.nativeElement.classList.remove('container-alter-field_box--edit');
      }
      
      this.toggleBoxEmojisAllNoView();
      this.disabledButtonForm();
    }

    toggleBoxEmojis(type: string){
      if(type == 'name'){
        this.viewEmojis = {
          ...this.viewEmojis,
          name: !this.viewEmojis['name']
        }
      } else if(type == 'description'){
        this.viewEmojis = {
          ...this.viewEmojis,
          description: !this.viewEmojis['description']
        }
      } 
    }
    toggleBoxEmojisAllNoView(){
      this.viewEmojis = {
        name: false
      };
    }

    disabledButtonForm(){
      let control = true;
      for(let i in this.viewEmojis){
        if(this.viewEmojis[i]) {
          this.formButtonDisabled = true;
          control = false;
          break;
        }
      };
      if(control && !this.variableOpenEditName 
        && !this.variableOpenEditDescription
       && !this.variableOpenEditPhone){
        this.formButtonDisabled = false;
      } else {
        this.formButtonDisabled = true;
      }
    }

}
