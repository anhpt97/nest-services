import { Module } from '@nestjs/common';
import { LambdaController } from './lambda.controller';
import { LambdaService } from './lambda.service';

@Module({
  controllers: [LambdaController],
  providers: [LambdaService],
})
export class LambdaModule {}
