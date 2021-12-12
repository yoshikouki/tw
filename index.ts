import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy@v0.19.3/command/mod.ts";

try {
    const command = new Command()
    const { options, args } = await command
        .name("tw")
        .description("tweet quickly")
        .option("-l, --timeline", "Show Timeline")
        .arguments("<text>")
        .parse(Deno.args)

    console.log(options)
    console.log(args)
} catch (e) {
    console.error(e)
}
