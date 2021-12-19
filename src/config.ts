import { ensureDirSync } from "fs/mod.ts";
import { basename, dirname } from "path/mod.ts";

export type ConfigJSONType = {
  "oauth_token"?: string;
  "oauth_token_secret"?: string;
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
  }

  exists(): boolean {
    return !!this.read();
  }

  read(): Config | null {
    try {
      const json: ConfigJSONType = JSON.parse(Deno.readTextFileSync(this.path));
      this.accessToken = json.oauth_token || null;
      this.accessTokenSecret = json.oauth_token_secret || null;
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
      Deno.writeTextFileSync(this.path, JSON.stringify(obj));
    } catch (err) {
      console.error("[ERROR]", err);
      Deno.exit(1);
    }
  }
}

export const saveConfig = (obj: ConfigJSONType) => {
  const config = new Config();
  config.save(obj);
};
