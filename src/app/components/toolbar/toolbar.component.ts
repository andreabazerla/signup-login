import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() isHandset$: Observable<boolean>;
  @Input() userIsAuthenticated: boolean;
  @Input() sidenav;

  @Output() eventEmitter = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  toggle(value: boolean) {
    this.eventEmitter.emit(value);
  }

}
