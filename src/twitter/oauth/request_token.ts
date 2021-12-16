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

export const getAuthenticateUrl = (
  requestToken: string,
): string => {
  return queryString.stringifyUrl({
    url: "https://api.twitter.com/oauth/authenticate",
    query: { "oauth_token": requestToken },
  });
};

export const obtainAccessToken = async (
  pin: string,
  requestToken: string,
): Promise<void> => {
  const method = "POST";
  const accessTokenUrl = "https://api.twitter.com/oauth/access_token";
  const options = {
    "oauth_verifier": pin,
    "oauth_token": requestToken,
  };
  const headers = createOAuthHeaders(method, accessTokenUrl, options);
  console.log(headers);
  const response = await fetch(
    queryString.stringifyUrl({ url: accessTokenUrl, query: options }),
    {
      method,
      headers,
    },
  );
  console.log(response);
  if (!response.ok) {
    console.error("[ERROR] failed to obtain access token.");
    Deno.exit(1);
  }
  const responseText = await response.text();
  const accessTokenObject = queryString.parse(responseText);
  console.log(accessTokenObject);
};
