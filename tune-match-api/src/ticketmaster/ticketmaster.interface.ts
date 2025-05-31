export interface Concert {
  proposedBy: string;
  ticketMasterId: string;
  name: string;
  url: string;
  date: {
    localDate: string;
    localTime: string;
    timezone: string;
  };
  location: {
    place: string;
    city: string;
    countryCode: string;
    address: string;
  };
}
