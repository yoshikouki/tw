import { saveConfig } from "/src/config.ts";
import {
  fetchRequestToken,
  getAuthenticateUrl,
  obtainAccessToken,
} from "/src/twitter/oauth/request_token.ts";
import { pp } from "/src/util.ts";
import { blue, bold } from "fmt/colors.ts";

export const setup = async () => {
  const requestToken = await fetchRequestToken();
  const authenticateUrl = await getAuthenticateUrl(requestToken);
  pp(`
    First, access this URL to authorize to access your account.
    ${bold(authenticateUrl)}
`);
  pp("Next, enter the PIN.");

  const input = prompt(bold("PIN: ")); // 文字列の入力を求める
  if (input === null || input === undefined) {
    console.error("[ERROR] PIN is required.");
    Deno.exit(1);
  }
  const accessTokenObject = await obtainAccessToken(input, requestToken);
  saveConfig(accessTokenObject);

  pp(`${bold("Congratulations!")} tw is ready!!1`);
  pp(blue(`
    Your access token is stored on ~/.config/tw/settings.json
    If you want to remove your data, please run one command of following.
    $ tw --clean
    $ rm -rf ~/.config/tw/settings.json
  `));
};
