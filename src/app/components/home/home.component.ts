import { Component, OnInit } from '@angular/core';

import { Action } from '../../models/action/action.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  actions: Action[] = [];

  constructor() { }

  ngOnInit(): void {
    let actionsArray: Action[] = [
      { text: 'Cerca un nuovo coinquilino con cui vivere', link: 'homeless' },
      { text: 'Stai ancora cercando una stanza? Clicca qui' },
      { text: 'Aggiorna il tuo profilo per ottenere più match' },
    ];
    this.actions = actionsArray;
  }

}
