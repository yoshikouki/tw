import { authorizeTw } from "/src/twitter.ts";
import { getConfig } from "/src/config.ts";
import { cli } from "/src/cli.ts";

const main = async () => {
  try {
    const { options, args } = await cli.parse(Deno.args);
    console.log(options, args);

    const config = await getConfig();
    if (!config.oauth_token || !config.oauth_token_secret) {
      return await authorizeTw();
    }
    console.log("Hey! ", config.screen_name);
  } catch (e) {
    console.error("[ERROR]", e);
    Deno.exit(1);
  }
};

await main();
