import { TestBed } from '@angular/core/testing';

import { GameContractService } from './game-contract.service';

describe('GameContractService', () => {
  let service: GameContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
