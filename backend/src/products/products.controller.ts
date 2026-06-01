import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductsService } from "./products.service";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Tạo product kèm danh sách variants" })
  @ApiResponse({ status: 201, description: "Tạo thành công" })
  @ApiBadRequestResponse({ description: "Dữ liệu không hợp lệ" })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Lấy danh sách tất cả products (kèm variants)" })
  @ApiResponse({ status: 200, description: "Danh sách products" })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy chi tiết 1 product (kèm variants)" })
  @ApiParam({ name: "id", type: Number, description: "ID product" })
  @ApiResponse({ status: 200, description: "Chi tiết product" })
  @ApiResponse({ status: 404, description: "Không tìm thấy" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Cập nhật product + variants" })
  @ApiParam({ name: "id", type: Number, description: "ID product" })
  @ApiResponse({ status: 200, description: "Cập nhật thành công" })
  @ApiResponse({ status: 404, description: "Không tìm thấy" })
  @ApiBadRequestResponse({ description: "Dữ liệu không hợp lệ" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xóa product" })
  @ApiParam({ name: "id", type: Number, description: "ID product" })
  @ApiResponse({ status: 200, description: "Xóa thành công" })
  @ApiResponse({ status: 404, description: "Không tìm thấy" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
