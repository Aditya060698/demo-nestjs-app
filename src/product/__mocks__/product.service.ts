/* eslint-disable prettier/prettier */
import { productStub } from '../test/stubs/product.stub';


export const ProductService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(productStub()),
  findAll:jest.fn().mockReturnValue([productStub()]),
  findOne:jest.fn().mockReturnValue(productStub()),
  update:jest.fn().mockReturnValue(productStub()),
  remove:jest.fn().mockReturnValue(productStub()),
});
