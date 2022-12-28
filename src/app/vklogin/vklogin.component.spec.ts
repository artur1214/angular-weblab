import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VKLoginComponent } from './vklogin.component';

describe('VKLoginComponent', () => {
  let component: VKLoginComponent;
  let fixture: ComponentFixture<VKLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VKLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VKLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
