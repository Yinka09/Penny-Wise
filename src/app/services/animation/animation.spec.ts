import { TestBed } from '@angular/core/testing';


describe('Animation', () => {
  let service: Animation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Animation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
