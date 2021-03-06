import 'source-map-support/register';
import type { S3CreateEvent, S3Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as sharp from 'sharp';
import { middyfy } from '@libs/lambda';

const s3 = new S3();

const convertToWebp: S3Handler = async (event: S3CreateEvent) => {
  const triggerBucketName = event.Records[0].s3.bucket.name;
  const objectKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  );

  const uploadedImage = await s3
    .getObject({ Bucket: triggerBucketName, Key: objectKey })
    .promise();

  const uploadedImageBody = uploadedImage.Body as Buffer;

  const sharpImageBuffer = await sharp(uploadedImageBody)
    .webp({ lossless: true })
    .toBuffer();

  const uploadKey = objectKey.replace('.png', '.webp');

  const params = {
    Body: sharpImageBuffer,
    Bucket: process.env.DESTINATION_BUCKET_NAME,
    ContentType: 'image/webp',
    CacheControl: 'max-age=31536000',
    Key: uploadKey,
    StorageClass: 'STANDARD',
  };

  await s3.putObject(params).promise();

  return;
};

export const main = middyfy(convertToWebp);
