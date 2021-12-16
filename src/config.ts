import * as queryString from "https://deno.land/x/querystring@v1.0.2/mod.js";
import { ensureDir } from "https://deno.land/std@0.117.0/fs/mod.ts";

export type ConfigObject = {
  "oauth_token"?: string;
  "oauth_token_secret"?: string;
  "screen_name"?: string;
  "user_id"?: string;
};

class Config {
  dirPath = `${Deno.env.get("HOME")}/.config/tw`;
  fileName = "settings.json";
  path = `${this.dirPath}/${this.fileName}`;
  save(obj: ConfigObject) {
    try {
      ensureDir(this.dirPath);
      console.log(obj);
      Deno.writeTextFile(this.path, JSON.stringify(obj));
    } catch (err) {
      console.error("[ERROR]", err);
      Deno.exit(1);
    }
  }
}

export const saveConfig = (obj: ConfigObject) => {
  const config = new Config();
  config.save(obj);
};
