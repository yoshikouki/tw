import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

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

  const jsonResponse = await fetch("https://api.github.com/users/denoland");
  const jsonData = await jsonResponse.json();
  console.log(jsonData);
} catch (e) {
  console.error("[ERROR]", e);
  Deno.exit(1);
}
