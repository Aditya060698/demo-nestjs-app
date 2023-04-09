import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { config } from 'rxjs';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Module({
  imports: [
    ProductModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/demo-products'),
    // SwaggerModule.forRoot({
    //   // Define the Swagger document options
    //   swaggerOptions: {
    //     docExpansion: 'none',
    //     deepLinking: true,
    //   },
    //   // Define the Swagger document configuration
    //   swaggerCustomOptions: {
    //     title: 'My API',
    //     description: 'API documentation',
    //     version: '1.0',
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
