import { createWriteStream } from "fs";
import { forwardTo } from "prisma-binding";
import * as shortid from "shortid";
import { Context, getUserId } from "../../utils";

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

interface ProductData {
  name?: string;
  price?: number;
  pictureUrl?: string;
}

export const product = {
  async createProduct(parent, { name, price, picture }, ctx: Context, info) {
    const userId = getUserId(ctx);
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
  },

  async updateProduct(
    parent,
    { id, name, price, picture },
    ctx: Context,
    info
  ) {
    const userId = getUserId(ctx);
    const product = await ctx.db.query.product(
      { where: { id } },
      `{seller { id }}`
    );
    if (userId !== product.seller.id) {
      throw new Error("Not authorized");
    }

    const data: ProductData = {};
    if (name) {
      data.name = name;
    }
    if (price) {
      data.price = price;
    }
    if (picture) {
      data.pictureUrl = await processUpload(picture);
    }

    return ctx.db.mutation.updateProduct(
      {
        data,
        where: {
          id
        }
      },
      info
    );
  },

  deleteProduct: forwardTo("db")
};
