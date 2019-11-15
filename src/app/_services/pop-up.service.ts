import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  makePopupWithTitle(name: string, title: string): string {
    return `
      <div>${title}: <b>${ name }</b></div>
      `;
  }

}
