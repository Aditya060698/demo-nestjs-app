/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Product } from '../src/product/dto/product.dto';
import { Model } from 'mongoose';
import { ProductModule } from '../src/product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let productModel: Model<Product>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ProductModule,
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: 'mongodb://localhost/products-test',
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    productModel = moduleFixture.get<Model<Product>>('ProductModel');
    await app.init();

    const config = new DocumentBuilder()
      .setTitle('Products example')
      .setDescription('The products API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  });

  beforeEach(async () => {
    await productModel.deleteMany({});
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('POST /products', () => {
    it('creates a product', async () => {
      const product: Product = {
        name: 'Test Product',
        description: 'A test product',
        price: 9.99,
        quantity: 10,
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(product)
        .expect(201);
      expect(response.body).toMatchObject(product);

      const createdProduct = await productModel
        .findById(response.body.id)
        .exec();
      expect(createdProduct).toMatchObject(product);
    });

    it('returns 400 if the name is missing', async () => {
      const product: Product = {
          description: 'A test product',
          price: 9.99,
          quantity: 10,
          name: ''
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(product)
        .expect(400);
    });

    it('returns 400 if the description is missing', async () => {
      const product: Product = {
          name: 'Test Product',
          price: 9.99,
          quantity: 10,
          description: ''
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(product)
        .expect(400);
    });

    it('returns 400 if the price is missing', async () => {
      const product: Product = {
          name: 'Test Product',
          description: 'A test product',
          quantity: 10,
          price: 0
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(product)
        .expect(400);
    });

    it('returns 400 if the quantity is missing', async () => {
      const product: Product = {
          name: 'Test Product',
          description: 'A test product',
          price: 9.99,
          quantity: 0
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(product)
        .expect(400);
    });
  });

  describe('GET /products', () => {
    it('returns an empty array', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);
      expect(response.body).toEqual([]);
    });

    it('returns a list of products', async () => {
      const products: Product[] = [
        {
          name: 'Test Product 1',
          description: 'A test product 1',
          price: 9.99,
          quantity: 10,
        },
        {
          name: 'Test Product 2',
          description: 'A test product 2',
          price: 19.99,
          quantity: 5,
        },
      ];

      await productModel.insertMany(products);

      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject(products[0]);
      expect(response.body[1]).toMatchObject(products[1]);
    });
  });

  describe('GET /products/:id', () => {
    it('returns a product', async () => {
      const product: Product = {
        name: 'Test Product',
        description: 'A test product',
        price: 9.99,
        quantity: 10,
      };

      const createdProduct = await productModel.create(product);

      const response = await request(app.getHttpServer())
        .get(`/products/${createdProduct._id}`)
        .expect(200);
      expect(response.body).toMatchObject(product);
    });

    it('returns 404 if the product does not exist', async () => {
      await request(app.getHttpServer())
        .get(`/products/${new Model().id}`)
        .expect(404);
    });
  });

  describe('PUT /products/:id', () => {
    it('updates a product', async () => {
      const product: Product = {
        name: 'Test Product',
        description: 'A test product',
        price: 9.99,
        quantity: 10,
      };

      const createdProduct = await productModel.create(product);

      const updateProduct: Product = {
        name: 'Updated Test Product',
        description: 'An updated test product',
        price: 19.99,
        quantity: 5,
      };

      const response = await request(app.getHttpServer())
        .put(`/products/${createdProduct._id}`)
        .send(updateProduct)
        .expect(200);
      expect(response.body).toMatchObject(updateProduct);

      const updatedProduct = await productModel
        .findById(createdProduct._id)
        .exec();
      expect(updatedProduct).toMatchObject(updateProduct);
    });

    it('returns 404 if the product does not exist', async () => {
      await request(app.getHttpServer())
        .put(`/products/${new Model().id}`)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /products/:id', () => {
    it('deletes a product', async () => {
      const product: Product = {
        name: 'Test Product',
        description: 'A test product',
        price: 9.99,
        quantity: 10,
      };

      const createdProduct = await productModel.create(product);

      await request(app.getHttpServer())
        .delete(`/products/${createdProduct._id}`)
        .expect(200);

      const deletedProduct = await productModel
        .findById(createdProduct._id)
        .exec();
      expect(deletedProduct).toBeNull();
    });

    it('returns 404 if the product does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`/products/${new Model().id}`)
        .expect(404);
    });
  });
});
