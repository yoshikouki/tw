import { Command } from "cliffy";

export const cli = new Command()
  .name("tw")
  .description("tweet quickly")
  .option("-l, --timeline", "Show Timeline")
  .arguments("[...text]");
