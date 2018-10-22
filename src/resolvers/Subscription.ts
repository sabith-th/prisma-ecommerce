import { Context } from "../utils";

export const Subscription = {
  feedSubscription: {
    subscribe: (parent, args, ctx: Context, info) => {
      return ctx.db.subscription.post(
        {
          where: {
            node: {
              isPublished: true
            }
          }
        },
        info
      );
    }
  },
  product: {
    subscribe: (parent, args, ctx: Context, info) => {
      return ctx.db.subscription.product(
        {
          where: {
            mutation_in: "UPDATED"
          }
        },
        info
      );
    }
  }
};
