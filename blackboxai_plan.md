# blackboxai_plan

## Thông tin đã nắm được

- Backend: NestJS + Prisma MySQL, CRUD cho `Product` và nested `variants`.
- `ProductsService` đang dùng chiến lược update: `deleteMany` variants theo `productId` rồi tạo mới.
- Không có sẵn backend/frontend code => cần **tạo mới toàn bộ** 2 project.
- Đúng theo spec user: NestJS + Prisma(MySQL) + Swagger + DTO validation; Frontend NextJS + React Hook Form + Zod + Tailwind.

## Kế hoạch triển khai (file-level)

### A. Backend (`backend/`)

1. Tạo `backend/package.json`, `nest` skeleton, cài deps:
   - @nestjs/\*, prisma, @prisma/client
   - @nestjs/swagger swagger-ui-express
   - class-validator class-transformer
   - mysql2
2. Tạo `backend/prisma/schema.prisma` với 2 model `Product`, `Variant` (quan hệ 1-n).
3. Tạo module:
   - `backend/src/products/products.module.ts`
   - `backend/src/products/products.controller.ts`
   - `backend/src/products/products.service.ts`
   - DTOs:
     - `backend/src/products/dto/create-product.dto.ts`
     - `backend/src/products/dto/create-variant.dto.ts`
4. Enable Swagger ở `backend/src/main.ts`.
5. Implement API:
   - POST /products (create product + variants)
   - GET /products (list incl variants)
   - GET /products/:id
   - PUT /products/:id (update product + variants)
   - DELETE /products/:id

### B. Frontend (`frontend/`)

1. Tạo `frontend/package.json`, NextJS App Router skeleton.
2. Cài deps:
   - react-hook-form, zod, @hookform/resolvers
   - tailwindcss
3. Tạo structure:
   - `frontend/src/schemas/productSchema.ts`
   - `frontend/src/components/ProductForm.tsx`
   - `frontend/src/components/VariantList.tsx`
   - `frontend/src/components/VariantRow.tsx`
   - `frontend/src/app/products/page.tsx`
4. Implement UI theo yêu cầu Tailwind + realtime metrics:
   - Tổng variants, tổng stock realtime (dùng `useWatch`).
   - useFieldArray quản lý variants dynamic; key = field.id.
   - Nút remove disabled khi còn 1 variant; tooltip.
   - Error message hiển thị đúng từng field nested.
5. Submit gọi API `POST /products` và `console.log` response.

### C. Chạy & kiểm tra

1. Backend:
   - Cấu hình `.env` (DATABASE_URL)
   - `prisma migrate dev`
2. Frontend:
   - Chạy `next dev`
3. Smoke test: tạo product, kiểm tra hiển thị errors & realtime.
