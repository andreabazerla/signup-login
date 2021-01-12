import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Services
import { ErrorService } from './../services/error/error.service';
import { LoggingService } from './../services/logging/logging.service';
import { NotifierService } from '../services/notifier/notifier.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const loggerService = this.injector.get(LoggingService);
    const notifierService = this.injector.get(NotifierService);

    let message;
    let stackTrace;

    if (error instanceof HttpErrorResponse) {
      // Server Error
      message = errorService.getServerMessage(error);
      stackTrace = errorService.getServerStack(error);
    } else {
      // Client Error
      message = errorService.getClientMessage(error);
      stackTrace = errorService.getClientStack(error);
    }

    if (message) {
      notifierService.add(message);
    }

    loggerService.logError(message, stackTrace);

    console.error(error);
  }
}
