import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestDataService {
  private guestData = new BehaviorSubject<any[]>([]);

  addData(item: any) {
    const currentData = this.guestData.value;
    this.guestData.next([...currentData, item]);
  }

  getData() {
    return this.guestData.asObservable();
  }

  clearData() {
    this.guestData.next([]);
  }
}
