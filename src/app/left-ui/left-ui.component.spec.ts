/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeftUiComponent } from './left-ui.component';

describe('LeftUiComponent', () => {
  let component: LeftUiComponent;
  let fixture: ComponentFixture<LeftUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
