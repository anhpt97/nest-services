import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { Injectable } from '@nestjs/common';
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from '~/common/constants';
import { PayloadDto } from './lambda.dto';

@Injectable()
export class LambdaService {
  private client: LambdaClient;

  constructor() {
    this.client = new LambdaClient({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });
  }

  async invoke(dto: PayloadDto) {
    const { Payload } = await this.client.send(
      new InvokeCommand({
        FunctionName: 'test',
        Payload: JSON.stringify(dto),
      }),
    );
    return JSON.parse(Buffer.from(Payload as any).toString());
  }
}
