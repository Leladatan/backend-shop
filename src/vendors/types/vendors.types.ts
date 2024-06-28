import { CreateVendorsPayloadDto } from '@/vendors/dto/vendors.dto';
import { Product, User, Vendor } from '@prisma/client';

export type isExistVendorType = {
  INN: string;
  OGRNIP: string;
  userId: number;
};
export type isExistVendorResponseType = {
  isExistINN: boolean;
  isExistOGRNIP: boolean;
  isExistUser: boolean;
};
export type updateVendorType = CreateVendorsPayloadDto & {
  vendorId: number;
};
export type getVendorWithUserWithProducts = Vendor & {
  user: User;
  products: Product[];
};
