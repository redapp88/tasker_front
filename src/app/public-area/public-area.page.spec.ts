import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PublicAreaPage } from './public-area.page';

describe('PublicAreaPage', () => {
  let component: PublicAreaPage;
  let fixture: ComponentFixture<PublicAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
