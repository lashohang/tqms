
import * as z from 'zod';

export const vehicleFormSchema = z.object({
  sthaniyasangh: z.string().min(1, 'Sthaniyasangh is required'),
  vehicleOwner: z.string().min(1, 'Vehicle Owner selection is required'),
  vehicleType: z.string().min(1, 'Vehicle Type selection is required'),
  plateColor: z.string().min(1, 'Plate Color selection is required'),

  engineNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  companyName: z.string().optional(),
  modelNo: z.string().optional(),

  plateType: z.string().min(1, 'Plate Type selection is required'),

  state: z.string().optional(),
  plateVehicleType: z.string().optional(),
  embossedVAIC: z.string().optional(),
  embossedVehicleNumber: z.string().optional(),

  registeredOffice: z.string().optional(),
  lotNumber: z.string().optional(),
  symbolNo: z.string().optional(),
  provincialVehicleNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.plateType === 'Embossed') {
    if (!data.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['state'],
        message: 'State is required',
      });
    }

    if (!data.plateVehicleType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['plateVehicleType'],
        message: 'Vehicle Type is required',
      });
    }

    if (!data.embossedVAIC?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['embossedVAIC'],
        message: 'Embossed VAIC is required',
      });
    }

    if (!/^\d{4}$/.test(data.embossedVehicleNumber || '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['embossedVehicleNumber'],
        message: 'Vehicle Number must contain exactly 4 digits',
      });
    }
  }

  if (data.plateType === 'Provincial') {
    if (!data.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['state'],
        message: 'State is required',
      });
    }

    if (!/^\d{2}$/.test(data.registeredOffice || '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['registeredOffice'],
        message: 'Registered Office must contain exactly 2 digits',
      });
    }

    if (!/^\d{1,3}$/.test(data.lotNumber || '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lotNumber'],
        message: 'Lot Number must contain 1 to 3 digits',
      });
    }

    if (!data.symbolNo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['symbolNo'],
        message: 'Symbol Number is required',
      });
    }

    if (!/^\d{1,4}$/.test(data.provincialVehicleNumber || '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['provincialVehicleNumber'],
        message: 'Vehicle Number must contain 1 to 4 digits',
      });
    }
  }
});

export type VehicleFormInputs = z.infer<typeof vehicleFormSchema>;
