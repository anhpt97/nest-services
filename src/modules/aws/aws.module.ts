import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { LambdaModule } from './lambda/lambda.module';
import { S3Module } from './s3/s3.module';
import { SesModule } from './ses/ses.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'aws',
        module: AwsModule,
        children: [
          {
            path: 'lambda',
            module: LambdaModule,
          },
          {
            path: 's3',
            module: S3Module,
          },
          {
            path: 'ses',
            module: SesModule,
          },
        ],
      },
    ]),
    LambdaModule,
    S3Module,
    SesModule,
  ],
})
export class AwsModule {}
