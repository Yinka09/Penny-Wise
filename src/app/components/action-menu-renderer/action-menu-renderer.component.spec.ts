import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMenuRendererComponent } from './action-menu-renderer.component';

describe('ActionMenuRendererComponent', () => {
  let component: ActionMenuRendererComponent;
  let fixture: ComponentFixture<ActionMenuRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionMenuRendererComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionMenuRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
