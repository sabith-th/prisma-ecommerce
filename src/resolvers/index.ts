import { AuthPayload } from "./AuthPayload";
import { auth } from "./Mutation/auth";
import { post } from "./Mutation/post";
import { product } from "./Mutation/product";
import { Query } from "./Query";
import { Subscription } from "./Subscription";

export default {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...product
  },
  Subscription,
  AuthPayload
};
