import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuggageDomainComponent } from './luggage-domain.component';

describe('LuggageDomainComponent', () => {
  let component: LuggageDomainComponent;
  let fixture: ComponentFixture<LuggageDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuggageDomainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LuggageDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
