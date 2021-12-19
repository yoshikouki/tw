import { createOAuthHeaders } from "/src/twitter/oauth/oauth_headers.ts";
import * as queryString from "querystring";
import { ConfigJSONType } from "/src/config.ts";

export const fetchRequestToken = async (): Promise<string> => {
  const method = "POST";
  const requestTokenUrl = "https://api.twitter.com/oauth/request_token";
  const options = { "oauth_callback": "oob" };

  const response = await fetch(
    queryString.stringifyUrl({ url: requestTokenUrl, query: options }),
    {
      method,
      headers: createOAuthHeaders(method, requestTokenUrl, options),
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
): Promise<ConfigJSONType> => {
  const method = "POST";
  const accessTokenUrl = "https://api.twitter.com/oauth/access_token";
  const options = {
    "oauth_verifier": pin,
    "oauth_token": requestToken,
  };
  const response = await fetch(
    queryString.stringifyUrl({ url: accessTokenUrl, query: options }),
    {
      method,
      headers: createOAuthHeaders(method, accessTokenUrl, options),
    },
  );
  if (!response.ok) {
    console.error("[ERROR] failed to obtain access token.");
    Deno.exit(1);
  }
  const accessTokenObject = queryString.parse(await response.text());
  return {
    "access_token": extractString(accessTokenObject.oauth_token),
    "access_token_secret": extractString(accessTokenObject.oauth_token_secret),
    "screen_name": extractString(accessTokenObject.screen_name),
    "user_id": extractString(accessTokenObject.user_id),
  };
};

const extractString = (val: string | string[] | null): string => {
  if (val === null) return "";
  switch (typeof val) {
    case "string":
      return val;
    default:
      return val.join(" ");
  }
};
