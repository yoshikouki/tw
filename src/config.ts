import { ensureDirSync } from "fs/mod.ts";
import { basename, dirname } from "path/mod.ts";
import * as dotenv from "dotenv";
import { bold, green } from "fmt/colors.ts";

export type ConfigJSONType = {
  "consumer_key"?: string;
  "consumer_secret"?: string;
  "access_token"?: string;
  "access_token_secret"?: string;
  "screen_name"?: string;
  "user_id"?: string;
};

interface ConfigOptions {
  path?: string;
}
export class Config {
  dirPath: string;
  fileName: string;
  path: string;
  consumerKey?: string | null;
  consumerSecret?: string | null;
  accessToken?: string | null;
  accessTokenSecret?: string | null;
  screenName?: string | null;
  userId?: string | null;

  constructor(
    options?: ConfigOptions,
  ) {
    const configPath = (options && options.path)
      ? options.path
      : `${Deno.env.get("HOME")}/.config/tw/tw.json`;
    this.dirPath = dirname(configPath);
    this.fileName = basename(configPath);
    this.path = `${this.dirPath}/${this.fileName}`;
    this.read();
    this.consumerKey ||= Deno.env.get("CONSUMER_KEY") ||
      dotenv.config().consumerKey;
    this.consumerSecret ||= Deno.env.get("CONSUMER_SECRET") ||
      dotenv.config().consumerSecret;
  }

  initialize(): void {
    if (!(this.consumerKey && this.consumerSecret)) {
      console.log([
        "",
        "[WARNING] Your consumer_key or consumer_secret for Twitter API is not found.",
        `Sure to use ${
          bold("trial key what is not secure")
        } because it is published.`,
        "See README for details.",
        green("https://github.com/yoshikouki/tw"),
        "",
      ].join("\n"));
      const confirmed = confirm(bold("Use the trial key?"));
      if (!confirmed) Deno.exit(0);
      this.consumerKey = "xn3e2UOyOsJz7MnhaHt4asl3e";
      this.consumerSecret =
        "KuSxVSyhrANhXUu9QcP4BzHxTpRPIVS2fAgDbIuT43ENeRFRDW";
    }
    this.save({
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
    });
    console.log([
      "",
      "Config file is created at ~/.config/tw/tw.json",
      "",
    ].join("\n"));
  }

  exists(): boolean {
    return !!this.read();
  }

  read(): Config | null {
    try {
      const json: ConfigJSONType = JSON.parse(Deno.readTextFileSync(this.path));
      this.consumerKey = json.consumer_key || null;
      this.consumerSecret = json.consumer_secret || null;
      this.accessToken = json.access_token || null;
      this.accessTokenSecret = json.access_token_secret || null;
      this.screenName = json.screen_name || null;
      this.userId = json.user_id || null;
      return this;
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) return null;
      throw err;
    }
  }

  save(obj: ConfigJSONType) {
    try {
      ensureDirSync(this.dirPath);
      const configText = JSON.stringify({ ...this.json(), ...obj });
      Deno.writeTextFileSync(this.path, configText);
    } catch (err) {
      console.error("[ERROR]", err);
      Deno.exit(1);
    }
  }

  json() {
    return {
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
      access_token: this.accessToken,
      access_token_secret: this.accessTokenSecret,
      screen_name: this.screenName,
      user_id: this.userId,
    };
  }
}

export const saveConfig = (obj: ConfigJSONType) => {
  const config = new Config();
  config.save(obj);
};
