import { authorizeTw, timeline, tweet } from "/src/twitter.ts";
import { Config } from "/src/config.ts";
import { cli } from "/src/cli.ts";

const main = async () => {
  try {
    const { options, args } = await cli.parse(Deno.args);

    const config = new Config();
    if (!(config.exists() && config.consumerKey && config.consumerSecret)) {
      config.initialize();
    }
    if (!(config.accessToken && config.accessTokenSecret)) {
      return await authorizeTw(config);
    }
    if (options.timeline) {
      return await timeline(config);
    }
    await tweet(args[0].join(" "), config);
  } catch (e) {
    console.error("[ERROR]", e);
    Deno.exit(1);
  }
};

await main();
