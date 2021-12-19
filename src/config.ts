import { ensureDirSync } from "fs/mod.ts";

export type ConfigJSONType = {
  "oauth_token"?: string;
  "oauth_token_secret"?: string;
  "screen_name"?: string;
  "user_id"?: string;
};

export class Config {
  dirPath = `${Deno.env.get("HOME")}/.config/tw`;
  fileName = "tw.json";
  path = `${this.dirPath}/${this.fileName}`;

  constructor(path?: string) {
    if (path) this.path = path;
  }

  exists(): boolean {
    return !!this.read();
  }

  read(): ConfigJSONType | null {
    try {
      const text = Deno.readTextFileSync(this.path);
      return JSON.parse(text);
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

export const getConfig = (): ConfigJSONType | null => {
  const config = new Config();
  return config.read();
};

export const saveConfig = (obj: ConfigJSONType) => {
  const config = new Config();
  config.save(obj);
};
