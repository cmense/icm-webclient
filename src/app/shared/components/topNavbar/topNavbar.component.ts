import { Component } from '@angular/core';
import { DropdownModule } from 'ng2-bootstrap/components/dropdown';

@Component({
  selector: 'top-navbar',
  templateUrl: 'topNavbar.component.html',
  styleUrls: ['topNavbar.component.css'],
})
export class TopNavbarComponent {
  public items: any[] = [{ name: 'Settings', route: '/settings' }, { name: 'Logout', route: '/login' }];

  constructor() { }

  ngOnInit() { }
}