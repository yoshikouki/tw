import { createOAuthHeaders } from "./oauth_headers.ts";
import * as queryString from "https://deno.land/x/querystring@v1.0.2/mod.js";

export const fetchRequestToken = async (): Promise<string> => {
  const method = "POST";
  const requestTokenUrl = "https://api.twitter.com/oauth/request_token";
  const options = { "oauth_callback": "oob" };
  const headers = createOAuthHeaders(method, requestTokenUrl, options);

  const response = await fetch(
    queryString.stringifyUrl({ url: requestTokenUrl, query: options }),
    {
      method,
      headers,
    },
  );
  const requestToken = queryString.parse(await response.text()).oauth_token;
  return typeof requestToken === "string" ? requestToken : "";
};

export const getAuthenticateUrl = async (): Promise<string> => {
  return queryString.stringifyUrl({
    url: "https://api.twitter.com/oauth/authenticate",
    query: { "oauth_token": await fetchRequestToken() },
  });
};
