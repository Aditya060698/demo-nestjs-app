/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductService } from '../product.service';
import { Product } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { productStub } from './stubs/product.stub';

describe('ProductService', () => {
  let productService: ProductService;
  let productModel: Model<Product>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: Model,
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    productModel = moduleRef.get<Model<Product>>(getModelToken(Product.name));
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = [productStub()];
      jest.spyOn(productModel, 'find').mockResolvedValue(result as Product[]);

      expect(await productService.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const result = { name: 'Product 1' };
      jest.spyOn(productModel, 'findById').mockResolvedValue(result as Product);

      expect(await productService.findOne('123')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: Product = { ...productStub()};
      const result = { ...createProductDto, _id: '123' };
      jest
        .spyOn(productModel.prototype, 'save')
        .mockResolvedValue(result as Product);

      expect(await productService.create(createProductDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = { name: 'Updated Product 1' ,price: 10,quantity:10,description:'test',};
      const result = { name: 'Updated Product 1', price: 10,quantity:10,description:'test', _id: '123' };
      jest
        .spyOn(productModel, 'findByIdAndUpdate')
        .mockResolvedValue(result as Product);

      expect(await productService.update('123', updateProductDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(productModel, 'findByIdAndDelete').mockResolvedValue(null);

      expect(await productService.remove('123')).toBe(undefined);
    });
  });
});
