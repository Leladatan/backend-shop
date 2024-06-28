import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VendorsService } from '@/vendors/vendors.service';
import { ProductsService } from '@/products/products.service';
import { Public } from '@/utils/decorators/public.decorator';
import { ItemsPayloadDto } from '@/utils/items.dto';
import { Vendor } from '@prisma/client';
import { VendorsPayloadDto } from '@/vendors/dto/vendors.dto';

@Controller('vendors')
export class VendorsController {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly productsService: ProductsService,
  ) {}

  @Public()
  @Get()
  async getVendors(
    @Query() query: { name: string },
  ): Promise<ItemsPayloadDto<Vendor>> {
    return this.vendorsService.getVendors(query.name);
  }

  @Public()
  @Get(':id')
  async getVendorId(@Param('id') vendorId: string): Promise<Vendor> {
    return this.vendorsService.getVendorId(Number(vendorId));
  }

  @Public()
  @Post()
  async createVendor(@Body() payload: VendorsPayloadDto): Promise<Vendor> {
    return this.vendorsService.createVendor(payload);
  }

  @Public()
  @Patch(':id')
  async updateVendor(
    @Param('id') vendorId: string,
    @Body() payload: VendorsPayloadDto,
  ): Promise<Vendor> {
    return this.vendorsService.updateVendor({
      vendorId: Number(vendorId),
      ...payload,
    });
  }

  // Products

  @Public()
  @Get(':id/products')
  async getProducts(
    @Param('id') vendorId: string,
    @Query() query: { name: string },
  ): Promise<ItemsPayloadDto<Vendor>> {
    return this.productsService.getProducts({
      vendorId: Number(vendorId),
      name: query.name,
    }) as Promise<ItemsPayloadDto<Vendor>>;
  }
}
