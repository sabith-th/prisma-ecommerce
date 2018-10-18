import { createWriteStream } from "fs";
import * as shortid from "shortid";
import { Context } from "../../utils";

const storeUpload = async ({ stream }): Promise<any> => {
  const path = `images/${shortid.generate()}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ path }))
      .on("error", reject)
  );
};

const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload;
  const { path } = await storeUpload({ stream });
  return path;
};

export const product = {
  async createProduct(parent, { name, price, picture }, ctx: Context, info) {
    // const userId = getUserId(ctx)
    const userId = "cjnbqc86o000h0a57j38ax2g5";
    return ctx.db.mutation.createProduct(
      {
        data: {
          name,
          price,
          seller: {
            connect: { id: userId }
          },
          pictureUrl: await processUpload(picture)
        }
      },
      info
    );
  }
};
