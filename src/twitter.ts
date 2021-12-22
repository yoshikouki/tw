import { Config, saveConfig } from "/src/config.ts";
import {
  fetchRequestToken,
  getAuthenticateUrl,
  obtainAccessToken,
} from "/src/twitter/oauth.ts";
import { blue, bold, gray, green } from "fmt/colors.ts";
import { postTweet } from "/src/twitter/tweet.ts";
import { getTimeline } from "/src/twitter/timeline.ts";

export const tweet = async (text: string, config: Config): Promise<void> => {
  const tweetResponse = await postTweet(text, config);
  const json = await tweetResponse.json();
  console.log(bold("tweeted!"));
  console.log(gray(`id: ${json.data.id}`));
  console.log(gray(`text: ${json.data.text}`));
};

export const timeline = async (config: Config): Promise<void> => {
  const timelineResponse = await getTimeline(config);
  const timeline = timelineResponse.map((tweet) => [
    "",
    gray(
      "--------------------------------------------------------------------------------",
    ),
    "",
    blue(`${tweet.user.name} ${"@" + tweet.user.screen_name}`),
    tweet.text,
    gray(`retweets: ${tweet.retweet_count}`),
    gray(`favorite: ${tweet.favorite_count}`),
  ]).flat();
  timeline.forEach((line) => console.log(line));
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
