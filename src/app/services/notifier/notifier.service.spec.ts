import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { NotifierService } from './notifier.service';

describe('SnackbarService', () => {
  let service: NotifierService;
  let matSnackBarModule: MatSnackBarModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
    });
    service = TestBed.inject(NotifierService);
    matSnackBarModule = TestBed.inject(MatSnackBarModule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
