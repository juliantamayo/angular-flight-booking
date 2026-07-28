export interface SelectedFlight {
  readonly id: string;
}

export interface SelectedFare {
  readonly code: 'basic' | 'classic' | 'flex';
}

export interface PassengerDraft {
  readonly isValid: boolean;
}

export interface ConfirmedBooking {
  readonly code: string;
}
