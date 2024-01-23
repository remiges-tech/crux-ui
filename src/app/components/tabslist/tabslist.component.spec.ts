import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabslistComponent } from './tabslist.component';

describe('TabslistComponent', () => {
  let component: TabslistComponent;
  let fixture: ComponentFixture<TabslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabslistComponent]
    });
    fixture = TestBed.createComponent(TabslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
