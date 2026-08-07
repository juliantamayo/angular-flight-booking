export interface SelectedFlight {
  readonly id: string;
  readonly flightNumber: string;
  readonly operator: string;
  readonly origin: string;
  readonly destination: string;
  readonly departureTime: string;
  readonly arrivalTime: string;
  readonly durationMinutes: number;
}

export interface SelectedFare {
  readonly code: 'basic' | 'classic' | 'flex';
  readonly name: string;
  readonly cabin: 'economy' | 'business';
  readonly price: number;
}

export interface PassengerDraft {
  readonly contact: PassengerContact;
  readonly isValid: boolean;
  readonly passengers: readonly PassengerInfo[];
}

export interface PassengerContact {
  readonly email: string;
  readonly phone: string;
}

export interface PassengerInfo {
  readonly birthDate: string;
  readonly documentNumber: string;
  readonly documentType: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly type: 'adult' | 'child' | 'infant';
}

export interface ServicesDraft {
  readonly selectedServices: readonly SelectedService[];
  readonly total: number;
}

export interface SeatsDraft {
  readonly selectedSeats: readonly SelectedSeat[];
  readonly total: number;
}

export interface SelectedSeat {
  readonly column: SeatColumn;
  readonly label: string;
  readonly passengerIndex: number;
  readonly price: number;
  readonly row: number;
}

export interface SelectedService {
  readonly code: ServiceCode;
  readonly name: string;
  readonly price: number;
}

export type SeatColumn = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type ServiceCode = 'extra-bag' | 'priority-boarding' | 'travel-insurance' | 'flex-assistance';

export interface ConfirmedBooking {
  readonly code: string;
}
