import { VendorsPayloadDto } from '@/vendors/dto/vendors.dto';

export type isExistVendorType = {
  INN: string;
  OGRNIP: string;
};
export type updateVendorType = VendorsPayloadDto & {
  vendorId: number;
};
