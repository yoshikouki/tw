import { authorizeTw } from "/src/twitter.ts";
import { Config } from "/src/config.ts";
import { cli } from "/src/cli.ts";

const main = async () => {
  try {
    const { options, args } = await cli.parse(Deno.args);
    console.log(options, args);

    const config = new Config();
    if (!(config.exists() && config.consumerKey && config.consumerSecret)) {
      config.initialize;
    }
    if (!(config.accessToken && config.accessTokenSecret)) {
      return await authorizeTw(config);
    }
    console.log("Hey! ", config.screenName);
  } catch (e) {
    console.error("[ERROR]", e);
    Deno.exit(1);
  }
};

await main();
