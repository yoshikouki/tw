import { Config, saveConfig } from "/src/config.ts";
import {
  fetchRequestToken,
  getAuthenticateUrl,
  obtainAccessToken,
} from "/src/twitter/oauth.ts";
import { blue, bold, green } from "fmt/colors.ts";
import * as queryString from "querystring";
import { createOAuthHeaders } from "/src/twitter/oauth/oauth_headers.ts";

export const tweet = async (text: string, config: Config): Promise<void> => {
  const method = "POST";
  const tweetUrl = "https://api.twitter.com/2/tweets";
  const options = {
    "status": text,
  };
  const response = await fetch(
    queryString.stringifyUrl({ url: tweetUrl }),
    {
      method,
      headers: createOAuthHeaders(method, tweetUrl, {}, config),
      body: JSON.stringify({ text: text }),
    },
  );
  if (!response.ok) {
    console.error("[ERROR] failed to tweet.", response);
    Deno.exit(1);
  }
};

export const authorizeTw = async (config: Config) => {
  const requestToken = await fetchRequestToken(config);
  const authenticateUrl = await getAuthenticateUrl(requestToken);
  console.log(
    "First, access this URL to authorize to access your account.\n",
    `${green(bold(authenticateUrl))}\n`,
  );

  console.log("Next, enter the PIN.");
  const input = prompt(bold("PIN: ")); // 文字列の入力を求める
  if (input === null || input === undefined) {
    console.error("[ERROR] PIN is required.");
    Deno.exit(1);
  }
  const accessTokenObject = await obtainAccessToken(
    input,
    requestToken,
    config,
  );
  saveConfig(accessTokenObject);

  console.log(`${bold("Congratulations!")} tw is ready!!1\n`);
  console.log(blue([
    "Your access token is stored on ~/.config/tw/settings.json",
    "If you want to remove your data, please run one command of following.",
    "$ tw --clean",
    "$ rm -rf ~/.config/tw/settings.json",
  ].join("\n")));
};
