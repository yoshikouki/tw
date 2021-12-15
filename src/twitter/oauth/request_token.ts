import { createOAuthHeaders } from "./oauth_headers.ts";
import { toQueryParams } from "../../util.ts";

const requestTokenUrl = "https://api.twitter.com/oauth/request_token";

export const fetchRequestToken = async (): Promise<string> => {
  const method = "POST";
  const options = { "oauth_callback": "oob" };
  const headers = createOAuthHeaders(method, requestTokenUrl, options);

  const response = await fetch(requestTokenUrl + "?" + toQueryParams(options), {
    method,
    headers,
  });
  return await response.text();
};
