import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsdetailComponent } from './tabsdetail.component';

describe('TabsdetailComponent', () => {
  let component: TabsdetailComponent;
  let fixture: ComponentFixture<TabsdetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabsdetailComponent]
    });
    fixture = TestBed.createComponent(TabsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
