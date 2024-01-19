import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BREschemaComponent } from './breschema.component';

describe('BREschemaComponent', () => {
  let component: BREschemaComponent;
  let fixture: ComponentFixture<BREschemaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BREschemaComponent]
    });
    fixture = TestBed.createComponent(BREschemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
