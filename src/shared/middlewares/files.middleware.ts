import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as busboy from 'busboy';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { IFile } from '../interfaces';

@Injectable()
export class FilesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const bb = busboy({
      headers: req.headers,
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    });

    const fields = {};
    const fileWrites: Promise<IFile>[] = [];
    /**
     * @description
     * Note: os.tmpdir() points to an in-memory file system on GCF
     * Thus, any files in it must fit in the instance's memory.
     */
    const tmpdir = os.tmpdir();

    bb.on('field', (key, value) => {
      let convertedValue: unknown;

      /**
       * @description
       * convert fields to their types because form data always strings
       */

      try {
        convertedValue = JSON.parse(value);
      } catch (e) {
        convertedValue = value;
      }

      fields[key] = convertedValue;
    });

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;

      const filepath = path.join(tmpdir, filename);
      console.warn(
        `Handling file upload field ${name}: ${filename} (${filepath})`,
      );
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      fileWrites.push(
        new Promise((resolve, reject) => {
          file.on('end', () => writeStream.end());
          writeStream.on('finish', () => {
            fs.readFile(filepath, (err, buffer) => {
              const size = Buffer.byteLength(buffer);
              if (err) {
                return reject(err);
              }

              try {
                fs.unlinkSync(filepath);
              } catch (error) {
                return reject(error);
              }

              resolve({
                fieldname: name,
                originalname: filename,
                encoding,
                mimetype: mimeType,
                buffer,
                size,
              });
            });
          });
          writeStream.on('error', reject);
        }),
      );
    });

    bb.on('finish', async () => {
      const files = (await Promise.all(fileWrites).catch(next)) as IFile[];

      const obj = files?.reduce((resultObj, curr) => {
        const { fieldname } = curr;
        const existingRecord = resultObj[fieldname];

        if (existingRecord) {
          resultObj[fieldname] = Array.isArray(existingRecord)
            ? [curr, ...existingRecord]
            : [curr, existingRecord];
        } else {
          resultObj[curr.fieldname] = curr;
        }

        return resultObj;
      }, {});

      // @ts-ignore
      req['body'] = {
        ...fields,
        ...obj,
      };

      next();
    });

    bb.end(req['rawBody']);
  }
}
