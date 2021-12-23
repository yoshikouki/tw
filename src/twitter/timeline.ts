import * as queryString from "querystring";
import { createOAuthHeaders } from "./oauth/oauth_headers.ts";
import { Config } from "../config.ts";
import { TimelineResponse } from "./types.d.ts";

export const getTimeline = async (
  config: Config,
): Promise<TimelineResponse> => {
  const method = "GET";
  const timelineUrl = `https://api.twitter.com/1.1/statuses/home_timeline.json`;
  const options = {};
  const request = new Request(
    queryString.stringifyUrl({ url: timelineUrl }),
    {
      method,
      headers: createOAuthHeaders(method, timelineUrl, options, config),
    },
  );
  const response = await fetch(request);
  if (!response.ok) {
    console.error("[ERROR] failed to fetch timeline.", await response.json());
    console.error("[ERROR] Request: ", request);
    Deno.exit(1);
  }
  return await response.json();
};
