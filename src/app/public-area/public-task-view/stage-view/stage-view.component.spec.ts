import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StageViewComponent } from './stage-view.component';

describe('StageViewComponent', () => {
  let component: StageViewComponent;
  let fixture: ComponentFixture<StageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageViewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
