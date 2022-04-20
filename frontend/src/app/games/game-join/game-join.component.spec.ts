import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameJoinComponent } from './game-join.component';

describe('GameJoinComponent', () => {
  let component: GameJoinComponent;
  let fixture: ComponentFixture<GameJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameJoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
