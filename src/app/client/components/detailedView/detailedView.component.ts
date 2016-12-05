import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { ModalType } from '../../../shared';
import { Email } from '../../shared';

@Component({
  selector: 'detailedView',  // <detailedView></detailedView>
  styleUrls: ['./detailedView.component.css'],
  templateUrl: './detailedView.component.html'
})
export class DetailedViewComponent {
  @Output() openModal = new EventEmitter<any>();

  @Input() email: Email;

  constructor() {
  }
  ngOnInit() {
    console.log('hello `DetailedViewComponent` component');
  }

  openReplyEmailModal() {
    this.openModal.emit(ModalType.reply);
  }

  openForwardEmailModal() {
    this.openModal.emit(ModalType.forward);
  }

}
