import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleMethod3Component } from './rule-method3.component';

describe('RuleMethod3Component', () => {
  let component: RuleMethod3Component;
  let fixture: ComponentFixture<RuleMethod3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleMethod3Component]
    });
    fixture = TestBed.createComponent(RuleMethod3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
