/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RightUiComponent } from './right-ui.component';

describe('RightUiComponent', () => {
  let component: RightUiComponent;
  let fixture: ComponentFixture<RightUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
