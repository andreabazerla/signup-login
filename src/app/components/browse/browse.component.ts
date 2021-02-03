// Angular
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';

// RxJs
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// Models
import { Room } from '../../models/room/room.model';

// Services
import { RoomsService } from './../../services/rooms/rooms.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  title = 'Browse';

  rooms$: Observable<Room[]>;

  filterForm = this.formBuilder.group({
    maxPrice: ['900'],
    minSurface: [''],
    maxSurface: [''],
    tagChips: [''],
  });

  tags: string[] = [
    'TV',
    'Garden',
    'Car Park',
    'Microwave',
    'Security Alarm',
    'Wi-Fi',
    'Air Conditioning',
    'Elevator',
    'Pool',
    'Balcony',
    'Basement',
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private roomsService: RoomsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tags.sort((a, b) => (a < b ? -1 : 1));

    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        this.setParams(params);
        this.getRooms(this.filterForm.value);
      },
    });
  }

  setParams(params) {
    if (params) {
      if (params.maxPrice) {
        this.filterForm.controls['maxPrice'].setValue(params.maxPrice);
      }

      if (params.minSurface) {
        this.filterForm.controls['minSurface'].setValue(params.minSurface);
      }

      if (params.maxSurface) {
        this.filterForm.controls['maxSurface'].setValue(params.maxSurface);
      }

      if (params.tagChips) {
        this.filterForm.controls['tagChips'].setValue(params.tagChips);
      }
    }
  }

  getRooms(filterForm): void {
    this.rooms$ = this.roomsService.getRooms(filterForm);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  toggleDrawer(matSidenav: MatSidenav) {
    const isSmallScreen = this.breakpointObserver.isMatched(
      '(max-width: 599px)'
    );
    if (isSmallScreen) {
      matSidenav.toggle();
    }
  }

  closeDrawer(matDrawer: MatDrawer): void {
    const isSmallScreen = this.breakpointObserver.isMatched(
      '(max-width: 599px)'
    );
    if (isSmallScreen) {
      matDrawer.close();
    }
  }

  clearFilter() {
    this.filterForm.reset({maxPrice: 900, minSurface: '', maxSurface: '', tagChips: []});
    this.router.navigate([]);
  }

  onSubmit() {
    let obj = this.filterForm.value;
    Object.keys(obj).forEach((key) => ((obj[key] === '' || obj[key] === null) ? delete obj[key] : {}));

    this.router.navigate([], {
      queryParams: obj,
      queryParamsHandling: 'merge',
    });
  }

  euroLabel(value: number) {
    return '€' + value;
  }
}
