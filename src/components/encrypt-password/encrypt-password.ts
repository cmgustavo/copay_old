import { Component, ComponentRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { InfoSheetComponent } from '../../components/info-sheet/info-sheet';
import { InfoSheetType } from '../../providers/action-sheet/action-sheet';
import { AppProvider } from '../../providers/app/app';
import { DomProvider } from '../../providers/dom/dom';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { ActionSheetParent } from '../action-sheet/action-sheet-parent';
@Component({
  selector: 'encrypt-password',
  templateUrl: 'encrypt-password.html'
})
export class EncryptPasswordComponent extends ActionSheetParent {
  public showForm: boolean;
  public encryptPasswordForm: FormGroup;
  public isCopay: boolean;
  public passwordInputType: string = 'password';
  public confirmPasswordInputType: string = 'password';

  constructor(
    private domProvider: DomProvider,
    private fb: FormBuilder,
    private appProvider: AppProvider,
    private externalLinkProvider: ExternalLinkProvider,
    private translate: TranslateService
  ) {
    super();
    this.isCopay = this.appProvider.info.name === 'copay';
    this.encryptPasswordForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.matchingPasswords('password', 'confirmPassword') }
    );
  }

  private matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
      return undefined;
    };
  }

  public showInfoSheet() {
    const infoSheet = this.createInfoSheet('encrypt-password-warning');
    infoSheet.present();
    infoSheet.onDidDismiss(option => {
      if (option) {
        this.dismiss();
      }
    });
  }

  public createInfoSheet(type: InfoSheetType, params?): InfoSheetComponent {
    return this.setupSheet<InfoSheetComponent>(InfoSheetComponent, type, params)
      .instance;
  }

  private setupSheet<T extends ActionSheetParent>(
    componentType: { new (...args): T },
    sheetType?: string,
    params?
  ): ComponentRef<T> {
    const sheet = this.domProvider.appendComponentToBody<T>(componentType);
    sheet.instance.componentRef = sheet;
    sheet.instance.sheetType = sheetType;
    sheet.instance.params = params;
    return sheet;
  }

  public next(): void {
    this.showForm = true;
  }

  public confirm(password: string): void {
    this.dismiss(password);
  }

  public openSupportEncryptPassword(): void {
    const url =
      'https://support.bitpay.com/hc/en-us/articles/360000244506-What-Does-a-Spending-Password-Do-';
    const optIn = false;
    const title = null;
    const message = this.translate.instant('Read more in our support page');
    const okText = this.translate.instant('Open');
    const cancelText = this.translate.instant('Go Back');
    this.externalLinkProvider.open(
      url,
      optIn,
      title,
      message,
      okText,
      cancelText
    );
  }
}
