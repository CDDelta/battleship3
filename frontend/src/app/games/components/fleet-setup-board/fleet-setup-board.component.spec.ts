import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetSetupBoardComponent } from './fleet-setup-board.component';

describe('FleetSetupBoardComponent', () => {
  let component: FleetSetupBoardComponent;
  let fixture: ComponentFixture<FleetSetupBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetSetupBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetSetupBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
