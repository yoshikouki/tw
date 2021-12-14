import { createOAuthHeaders } from "./oauth_headers.ts";

const requestTokenUrl = "https://api.twitter.com/oauth/request_token";

export const fetchRequestToken = async (): Promise<string> => {
  const url = requestTokenUrl;
  const method = "POST";
  const options = {
    "oauth_callback": "oob",
  };
  const headers = createOAuthHeaders(method, url, options);

  const requestTokenReq = new Request(url, {
    method,
    headers,
  });
  console.log(requestTokenReq.headers);
  const response = await fetch(requestTokenReq);
  return await response.json();
};
