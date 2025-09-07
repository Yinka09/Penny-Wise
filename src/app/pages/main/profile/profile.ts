import { Component, type OnDestroy, type OnInit } from '@angular/core';
import { SpinnerComponent } from '../../../components/spinner/spinner';
import { routerTransitions2 } from '../../../services/animation/animation';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { MainService } from '../../../services/main/main';
import { Checkbox } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../services/auth/auth';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile',
  imports: [
    SpinnerComponent,
    FormsModule,
    ToggleSwitch,
    Checkbox,
    ButtonModule,
    AvatarModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  providers: [MessageService, ConfirmationService],
  animations: [routerTransitions2],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoading = true;
  isVisible = false;
  checkedNotifications: boolean = false;
  checkedCampaigns: boolean = true;
  checkedPassword: boolean = false;
  checkedEmail: boolean = true;
  userData: {
    email: string;
    id: string;
    _token: string;
    _tokenExpirationDate: string;
  } | null = null;

  destroy$ = new Subject<void>();
  constructor(
    private mainService: MainService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.isVisible = true;
    this.userData = sessionStorage.getItem('userData')
      ? JSON.parse(sessionStorage.getItem('userData') || '{}')
      : {};

    this.mainService.headerTitle.set('Profile');
    this.mainService.setIsTransactionPage(false);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onDeleteAccount(event: any) {
    if (!this.userData) {
      return;
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete your account?`,
      header: `Delete Account`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        // this.transactionsService.updateTransactionType(data, type);
        const idToken = this.userData?._token;

        this.authService
          .deleteUser(idToken ? idToken : '')
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              // this.isLoading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Account Deleted Successfully`,
                life: 2000,
              });

              setTimeout(() => {
                this.isLoading = true;
              }, 2500);

              setTimeout(() => {
                this.authService.logout();
              }, 3000);
            },
            (errorMessage) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
              });
              // this.showErrorAlert(errorMessage);
              this.isLoading = false;
            }
          );
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Delete Action cancelled',
        });
      },
    });
  }
  ngOnDestroy(): void {
    this.isLoading = false;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
