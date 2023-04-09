/* eslint-disable prettier/prettier */
import { Product } from '../../schemas/product.schema';

export const productStub=() :Product =>{
    return {
        name: 'Test Product',
        description: 'A test product',
        price: 9.99,
        quantity: 10,
    }
}