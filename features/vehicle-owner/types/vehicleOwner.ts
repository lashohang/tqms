
export interface SavedDocument {
  name: string;
  type: string;
  dataUrl: string;
}

export interface VehicleOwner {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNo: string;
  isAssigned: 'Assigned' | 'Not Assi';

  state?: string;
  district?: string;
  localLevel?: string;
  streetAddress?: string;
  panNumber?: string;
  isIndividual?: boolean;
  citizenshipNo?: string;
  registrationNo?: string;
  contactName?: string;
  contactEmail?: string;
  contactNumber?: string;

  // Uploaded documents
  citizenshipFront?: SavedDocument | null;
  citizenshipBack?: SavedDocument | null;
  registrationDocument?: SavedDocument | null;
  companyLogo?: SavedDocument | null;
}
