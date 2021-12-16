import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { setup } from "./src/twitter.ts";

const cmd = new Command()
  .name("tw")
  .description("tweet quickly")
  .option("-l, --timeline", "Show Timeline")
  .arguments("[...text]");

try {
  const { options, args } = await cmd.parse(Deno.args);
  console.log(options, args);

  await setup();
} catch (e) {
  console.error("[ERROR]", e);
  Deno.exit(1);
}
