import { createOAuthHeaders } from "./oauth_headers.ts";
import { toQueryParams } from "../../util.ts";

const requestTokenUrl = "https://api.twitter.com/oauth/request_token";

export const fetchRequestToken = async (): Promise<string> => {
  const method = "POST";
  const options = {
    "oauth_callback": "oob",
  };
  const url = requestTokenUrl + "?" + toQueryParams(options);
  const headers = createOAuthHeaders(method, url, options);

  const requestTokenReq = new Request(url, {
    method,
    headers,
  });
  const response = await fetch(requestTokenReq);
  return await response.text();
};
