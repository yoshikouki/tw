import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { TwitterApi } from "https://raw.githubusercontent.com/stefanuros/deno_twitter_api/master/mod.ts";

const cmd = new Command()
  .name("tw")
  .description("tweet quickly")
  .option("-l, --timeline", "Show Timeline")
  .arguments("[text]");

try {
  const { options, args } = await cmd.parse(Deno.args);

  console.log(
    "\n",
    "[options]",
    "\n",
    options,
    "\n",
    "\n",
    "[args]",
    "\n",
    args,
  );

  const conf = config();
  console.log(conf.test);

  const api = new TwitterApi({
    consumerApiKey: conf.consumerApiKey,
    consumerApiSecret: conf.consumerApiSecret,
    accessToken: conf.accessToken,
    accessTokenSecret: conf.accessTokenSecret,
  });
  const res = await api.post("statuses/update.json", {
    status: "deno でつぶやいてみるぞーーー",
  });
  console.log(await res.json());
} catch (e) {
  console.error("[ERROR]", e);
  Deno.exit(1);
}
