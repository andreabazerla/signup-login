import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChip, MatChipList } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ChipsComponent,
      multi: true,
    },
  ],
})
export class ChipsComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild(MatChipList)
  matChipList!: MatChipList;

  @Input() tags: string[] = [];

  disabled = false;
  value: string[] = [];

  chipSubscription$: Subscription;

  constructor() {}

  onChange: any = (value: string[]) => {
    console.log(value);
  }

  onTouch: any = () => {}

  writeValue(value: string[]): void {
    if (this.matChipList && value) {
      this.selectChips(value);
    } else if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.selectChips(this.value);

    this.chipSubscription$ = this.matChipList.chipSelectionChanges
      .pipe(
        // untilDestroyed(this),
        map((event) => event.source)
      )
      .subscribe((chip) => {
        if (chip.selected) {
          this.value = [...this.value, chip.value];
        } else {
          this.value = this.value.filter((o) => o !== chip.value);
        }

        this.propagateChange(this.value);
      });
  }

  propagateChange(value: string[]) {
    if (this.onChange) {
      this.onChange(value);
    }
  }

  selectChips(value: string[]) {
    this.matChipList.chips.forEach((chip) => chip.deselect());

    const chipsToSelect = this.matChipList.chips.filter(
      (chip) => value.includes(chip.value)
    );

    chipsToSelect.forEach((chip) => chip.select());
  }

  toggleSelection(matChip: MatChip) {
    if (!this.disabled) matChip.toggleSelected();
  }

  ngOnDestroy(): void {
    this.chipSubscription$.unsubscribe();
  }
}
