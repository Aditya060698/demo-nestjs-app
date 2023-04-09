/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
// import { Product } from '../dto/product.dto';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { Product } from '../schemas/product.schema';
import { productStub } from './stubs/product.stub';

jest.mock('../product.service')
describe('ProductController', () => {
  let productController: ProductController;
  let productService:ProductService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    productController = app.get<ProductController>(ProductController);
    productService = app.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });
  describe('create',()=>{
    describe('when create is called',()=>{
      let product: Product;

      beforeEach(async ()=>{
        product=await productController.create(productStub());
        console.log(productStub);
        
      })
      test('then it should call productService',()=>{
        expect(productService.create).toBeCalledWith(productStub())
      })
      test('then it should return product',()=>{
        expect(product).toEqual(productStub())
      })
    })
  })
  describe('findAll',()=>{
    describe('when findAll is called',()=>{
      let product: Product[];

      beforeEach(async ()=>{
        product=await productController.findAll();        
      })
      test('then it should call productService',()=>{
        expect(productService.findAll).toBeCalled();
      })
      test('then it should return product',()=>{
        expect(product).toEqual([productStub()])
      })
    })
  })
  describe('findOne',()=>{
    describe('when findOne is called',()=>{
      let product: Product;

      beforeEach(async ()=>{
        product=await productController.findOne('6432b0b3724a31938ce9e2a7');        
      })
      test('then it should call productService',()=>{
        expect(productService.findOne).toBeCalledWith('6432b0b3724a31938ce9e2a7')
      })
      test('then it should return product',()=>{
        expect(product).toEqual(productStub())
      })
    })
  })
  describe('update',()=>{
    describe('when update is called',()=>{
      let product: Product;

      beforeEach(async ()=>{
        product=await productController.update('6432b0b3724a31938ce9e2a7',productStub());        
      })
      test('then it should call productService',()=>{
        expect(productService.update).toBeCalledWith('6432b0b3724a31938ce9e2a7',productStub())
      })
      test('then it should return product',()=>{
        expect(product).toEqual(productStub())
      })
    })
  })
  describe('remove',()=>{
    describe('when remove is called',()=>{
      let product: Product;

      beforeEach(async ()=>{
        product=await productController.remove('6432b0b3724a31938ce9e2a7');
        console.log(productStub);
        
      })
      test('then it should call productService',()=>{
        expect(productService.remove).toBeCalledWith('6432b0b3724a31938ce9e2a7')
      })
      test('then it should return product',()=>{
        expect(product).toEqual(productStub())
      })
    })
  })
    it('should be defined', () => {
      expect(productController).toBeDefined();
    });

  });
