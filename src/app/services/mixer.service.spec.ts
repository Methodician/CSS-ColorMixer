/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MixerService } from './mixer.service';

describe('MixerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MixerService]
    });
  });

  it('should ...', inject([MixerService], (service: MixerService) => {
    expect(service).toBeTruthy();
  }));
});
