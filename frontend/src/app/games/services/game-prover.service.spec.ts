import { TestBed } from '@angular/core/testing';

import { GameProverService } from './game-prover.service';

describe('GameProverService', () => {
  let service: GameProverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameProverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
