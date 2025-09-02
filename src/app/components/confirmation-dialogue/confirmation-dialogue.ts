import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirmation-dialogue',
  imports: [ConfirmDialogModule, ToastModule, ButtonModule],
  templateUrl: './confirmation-dialogue.html',
  styleUrl: './confirmation-dialogue.scss',
  providers: [ConfirmationService, MessageService],
})
export class ConfirmationDialogue {
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  confirm2(event: Event) {
   
  }
}
