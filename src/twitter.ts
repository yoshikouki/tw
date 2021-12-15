import { getAuthenticateUrl } from "./twitter/oauth/request_token.ts";

console.log(await getAuthenticateUrl());
