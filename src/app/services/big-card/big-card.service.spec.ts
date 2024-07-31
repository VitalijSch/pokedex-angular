import { TestBed } from '@angular/core/testing';

import { BigCardService } from './big-card.service';

describe('BigCardService', () => {
  let service: BigCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BigCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
