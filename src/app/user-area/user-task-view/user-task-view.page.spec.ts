import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTaskViewPage } from './user-task-view.page';

describe('UserTaskViewPage', () => {
  let component: UserTaskViewPage;
  let fixture: ComponentFixture<UserTaskViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTaskViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTaskViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
