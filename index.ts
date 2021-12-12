import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";

const cmd = new Command()
  .name("tw")
  .description("tweet quickly")
  .option("-l, --timeline", "Show Timeline")
  .arguments("<text>");

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
} catch (e) {
  console.error("[ERROR]", e);
  Deno.exit(1);
}
