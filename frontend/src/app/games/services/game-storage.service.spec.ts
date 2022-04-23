import { TestBed } from '@angular/core/testing';

import { GameStorageService } from './game-storage.service';

describe('GameStorageService', () => {
  let service: GameStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
