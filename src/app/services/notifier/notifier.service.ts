import { Injectable, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';

export class SnackBarMessage {
  message: string;
  action: string = null;
  config: MatSnackBarConfig = null;
}

@Injectable({
  providedIn: 'root',
})
export class NotifierService implements OnDestroy {
  private messageQueue: SnackBarMessage[] = [];
  private isVisible = false;
  private subscription: Subscription;
  private matSnackBarRef: MatSnackBarRef<TextOnlySnackBar>;

  constructor(public matSnackBar: MatSnackBar) {}

  add(message: string, action?: string, config?: MatSnackBarConfig): void {
    if (!config) {
      config = new MatSnackBarConfig();
      config.duration = 5000;
    }

    const snackbarMessage = new SnackBarMessage();
    snackbarMessage.message = message;
    snackbarMessage.action = action;
    snackbarMessage.config = config;

    this.messageQueue.push(snackbarMessage);
    if (!this.isVisible) {
      this.showNext();
    }
  }

  showNext(): void {
    if (this.messageQueue === undefined || this.messageQueue.length === 0) {
      return;
    }

    const snackbarMessage = this.messageQueue.shift();
    this.isVisible = true;

    this.matSnackBarRef = this.matSnackBar.open(
      snackbarMessage.message,
      snackbarMessage.action,
      snackbarMessage.config
    );

    this.matSnackBarRef.afterDismissed().subscribe(() => {
      this.isVisible = false;
      this.showNext();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
