import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppState } from '../app.service';
import * as moment from 'moment';
import { ModalDirective } from 'ng2-bootstrap';
import { Email } from './shared';
import { EmailService, TaskService } from './shared';
import { Observable } from 'rxjs/Observable';
import { ModalType } from '../shared/constants';

@Component({
  selector: 'client',
  providers: [],
  styleUrls: ['./client.component.css'],
  templateUrl: './client.component.html'
})
export class ClientComponent {
  public emails: Email[] = [];
  public email: Email = null;
  public currentModalType: ModalType = null;
  public loading: boolean = true;
  public syncing: boolean = true;
  private currentBox: Observable<string>;
  private currentId: Observable<string>;
  private taskName: string = 'testName';
  private createdTask: any = null;
  public suggestedTask: any = {};
  public tasksForMail: any = [];
  public boxList: any = [];

  constructor(private _emailService: EmailService, private _taskService: TaskService, public appState: AppState, public router: Router, public route: ActivatedRoute) {
    this.currentId = this.route.params.map(params => params['emailId'] || 'None');
    this.currentBox = this.route.params.map(params => params['boxId'] || 'None');
  }

  ngOnInit() {
    this.syncing = true;
    if (!(this.appState.get('boxList').length > 0)) {
      this.getBoxList().subscribe((data: any[]) => {
        if (data.length > 0) {
          this.syncing = false;
          this.appState.set('boxList', data);
          this.boxList = data;
          this.getEmailBox(data[0]);
          this.fetchBoxByRouteId();
          this.fetchMailByRouteId();
        }
      });
    } else {
      this.boxList = this.appState.get('boxList');
      this.syncing = false;
      this.fetchBoxByRouteId();
      this.fetchMailByRouteId();
    }
  }

  fetchMailByRouteId() {
    this.currentId.subscribe((emailId) => {
      emailId === 'None' ? '' : this.getSingleMail(emailId);
    });
  }

  fetchBoxByRouteId() {
    this.currentBox.subscribe((boxId) => {
      boxId === 'None' ? '' : this.getEmailBox(this.boxList.filter((box) => box.id == boxId)[0]);
    });
  }

  getBoxList() {
    return this._emailService.updateMailboxList();
  }

  getSingleMail(id?: string) {
    this._emailService
      .getSingleMail(id)
      .subscribe((data: any) => {
        this.email = data;
        this.suggestedTask = this._taskService.createSuggestedTask(this.email);
        this.tasksForMail = [];
        this.getTasksForMail(this.email.tasks);
      },
      error => {
        console.log(error)
      },
      () => {
        console.log(`Message with ID: ${id} has been successfully loaded`)
      });
  }

  getTasksForMail(tasks: any) {
    tasks.forEach((task) => {
      this._taskService
        .getTaskByID(task.id)
        .subscribe((data: any) => {
          console.log(data);
          this.tasksForMail.push(data);
        });
    });
  }

  syncTasksForMail() {
    this.getTasksForMail(this.email.tasks);
  }

  getEmailBox(box?: any) {
    this.loading = true;
    this._emailService
      .getEmailsWithPagination(box.name)
      .subscribe((data: any) => {
        this.emails = data.docs.map((email) => {
          email.route = `/box/${email.box.id}/${email._id}`;
          return email;
        });
        console.log(this.emails);
        this.loading = false;
      },
      error => {
        console.log(error)
      },
      () => { console.log(`Mails successfully loaded`) });
  }

  openModal(type?: ModalType) {
    this.currentModalType = type;
  }

  closeModal() {
    this.currentModalType = null;
  }

  onRefresh(refresh?: boolean) {
    this.syncBoxes([]);
  }

  syncBoxes(boxes: string[]) {
    this.syncing = true;
    this._emailService.updateMailboxList().subscribe((data) => {
      this.appState.set('boxList', data);
      this.boxList = data;
      this._emailService.getEmails([]).subscribe((data: any) => {
        this.syncing = false;
        this.getEmailBox(this.boxList[0]);
      });
    });
  }

}
