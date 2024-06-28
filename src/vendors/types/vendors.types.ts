import { VendorsPayloadDto } from '@/vendors/dto/vendors.dto';

export type isExistVendorType = {
  INN: string;
  OGRNIP: string;
  userId: number;
};
export type updateVendorType = VendorsPayloadDto & {
  vendorId: number;
};
