import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_ACCESS_KEY,
} from '~/common/constants';
import { DownloadFileDto } from './s3.dto';

@Injectable()
export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });
  }

  async download({ filename }: DownloadFileDto) {
    const { Body } = await this.client.send(
      new GetObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: filename,
      }),
    );
    return Buffer.from(await Body.transformToByteArray());
  }

  async generatePresignedUrl() {
    return await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: randomUUID(),
      }),
    );
  }

  async upload(files: Express.Multer.File[]) {
    await Promise.all(
      files.map(({ originalname, mimetype, buffer }) =>
        this.client.send(
          new PutObjectCommand({
            ACL: 'public-read',
            Body: buffer,
            Bucket: AWS_S3_BUCKET,
            ContentType: mimetype,
            Key: originalname,
          }),
        ),
      ),
    );
  }
}
