import * as queryString from "querystring";
import { Config } from "/src/config.ts";
import { createOAuthHeaders } from "/src/twitter/oauth/oauth_headers.ts";
import { TweetResponse } from "/src/twitter/types.d.ts";

export const postTweet = async (
  text: string,
  config: Config,
): Promise<TweetResponse> => {
  const method = "POST";
  const tweetUrl = "https://api.twitter.com/2/tweets";
  const body = {
    "text": text,
  };
  const request = new Request(
    queryString.stringifyUrl({ url: tweetUrl }),
    {
      method,
      headers: createOAuthHeaders(method, tweetUrl, {}, config),
      body: JSON.stringify(body),
    },
  );
  const response = await fetch(request);
  if (!response.ok) {
    console.error("[ERROR] failed to tweet.", response);
    console.error("[ERROR] Request: ", request);
    Deno.exit(1);
  }
  return await response.json();
};
