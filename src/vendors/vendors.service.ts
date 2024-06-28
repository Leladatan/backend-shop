import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ItemsPayloadDto } from '@/utils/items.dto';
import { Vendor } from '@prisma/client';
import { VendorsPayloadDto } from '@/vendors/dto/vendors.dto';
import {
  getVendorWithUserWithProducts,
  isExistVendorType,
  updateVendorType,
} from '@/vendors/types/vendors.types';
import { UsersService } from '@/users/users.service';

@Injectable()
export class VendorsService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async getVendors(name: string): Promise<ItemsPayloadDto<Vendor>> {
    return this.getVendorsItemsPayloadDto(name);
  }

  async getVendorId(vendorId: number): Promise<getVendorWithUserWithProducts> {
    return this.findVendor(vendorId);
  }

  async createVendor(payload: VendorsPayloadDto): Promise<Vendor> {
    await this.usersService.findUser({ userId: payload.userId });
    await this.isExistVendor({
      INN: payload.INN,
      OGRNIP: payload.OGRNIP,
      userId: payload.userId,
    });
    return this.prismaService.vendor.create({
      data: {
        ...payload,
      },
    });
  }

  async updateVendor({
    vendorId,
    ...payload
  }: updateVendorType): Promise<Vendor> {
    await this.findVendor(vendorId);
    return this.prismaService.vendor.update({
      where: {
        id: vendorId,
      },
      data: {
        ...payload,
      },
    });
  }

  async getVendorsItemsPayloadDto(
    name?: string,
  ): Promise<ItemsPayloadDto<Vendor>> {
    if (name) {
      const [items, total] = await this.prismaService.$transaction([
        this.prismaService.vendor.findMany({
          where: {
            name: { contains: name },
          },
          orderBy: {
            id: 'asc',
          },
        }),
        this.prismaService.vendor.count({
          where: {
            name: { contains: name },
          },
        }),
      ]);

      return {
        items,
        total,
      };
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.vendor.findMany({
        orderBy: {
          id: 'asc',
        },
      }),
      this.prismaService.vendor.count(),
    ]);

    return {
      items,
      total,
    };
  }

  async isExistVendor({
    INN,
    OGRNIP,
    userId,
  }: isExistVendorType): Promise<boolean> {
    const vendor: Vendor | null = await this.prismaService.vendor.findUnique({
      where: {
        INN,
        OGRNIP,
        userId,
      },
    });

    if (vendor) throw new BadRequestException('Vendor already exists');

    return !!vendor;
  }

  async findVendor(vendorId: number): Promise<getVendorWithUserWithProducts> {
    const vendor: getVendorWithUserWithProducts | null =
      await this.prismaService.vendor.findUnique({
        where: {
          id: vendorId,
        },
        include: {
          user: true,
          products: true,
        },
      });

    if (!vendor) throw new NotFoundException('Vendor not found');

    return vendor;
  }
}
