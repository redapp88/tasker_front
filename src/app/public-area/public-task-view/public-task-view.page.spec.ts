import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PublicTaskViewPage } from './public-task-view.page';

describe('PublicTaskViewPage', () => {
  let component: PublicTaskViewPage;
  let fixture: ComponentFixture<PublicTaskViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicTaskViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicTaskViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
