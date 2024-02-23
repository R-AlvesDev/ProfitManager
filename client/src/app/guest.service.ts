import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private isGuest: boolean = false;

  setIsGuest(value: boolean){
    this.isGuest = value;
  }

  getIsGuest(){
    return this.isGuest;
  }
}
