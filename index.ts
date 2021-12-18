import { Command } from "cliffy";
import { setup } from "/src/twitter.ts";
import { getConfig } from "/src/config.ts";

const run = async () => {
  const cmd = new Command()
    .name("tw")
    .description("tweet quickly")
    .option("-l, --timeline", "Show Timeline")
    .arguments("[...text]");

  try {
    const { options, args } = await cmd.parse(Deno.args);
    console.log(options, args);

    const config = await getConfig();
    if (config === false || !config.oauth_token || !config.oauth_token_secret) {
      return await setup();
    }
    console.log("Hey! ", config.screen_name);
  } catch (e) {
    console.error("[ERROR]", e);
    Deno.exit(1);
  }
};

await run();
