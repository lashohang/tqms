import * as z from 'zod';

export const vehicleOwnerSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  state: z.string().min(1, 'State selection is required'),

  district: z.string().min(1, 'District selection is required'),

  localLevel: z.string().optional(),

  streetAddress: z.string().optional(),

  email: z
    .string()
    .email('Invalid email address format')
    .or(z.literal('')),

  panNumber: z.string().optional(),

  phoneNo: z
    .string()
    .min(10, 'Phone Number must be at least 10 digits'),

  isIndividual: z.boolean().default(true),

  citizenshipNo: z.string().optional(),

  registrationNo: z.string().optional(),

  contactName: z.string().optional(),

  contactEmail: z.string().optional(),

  contactNumber: z.string().optional(),
});

export type VehicleOwnerFormInputs = z.infer<
  typeof vehicleOwnerSchema
>;