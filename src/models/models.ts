export interface RSVP {
  uid: string;                 // Unique identifier for the RSVP
  id: string;                  // Unique identifier for the party
  idFromQRCode?: string;       // Unique identifier from QR code
  guests: Guest[];             // Guests in party
} 

export interface Guest {
  attending: boolean;          // RSVP status
  name: string;                // Name of the guest
  foodPreference: string;      // Food preferences
  allergies: string[];         // List of allergies
  additionalNotes?: string;    // Additional notes (optional)
}

export interface PostRSVPRequest {
  rsvp: RSVP;
}

export interface PostRSVPResponse {
  success: boolean;
  message?: string;
}
