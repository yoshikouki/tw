import { ensureDir } from "fs/mod.ts";

export type ConfigJSONType = {
  "oauth_token"?: string;
  "oauth_token_secret"?: string;
  "screen_name"?: string;
  "user_id"?: string;
};

class Config {
  dirPath = `${Deno.env.get("HOME")}/.config/tw`;
  fileName = "tw.json";
  path = `${this.dirPath}/${this.fileName}`;

  async read(): Promise<ConfigJSONType> {
    try {
      return JSON.parse(await Deno.readTextFile(this.path));
    } catch (err) {
      throw err;
    }
  }

  save(obj: ConfigJSONType) {
    try {
      ensureDir(this.dirPath);
      Deno.writeTextFileSync(this.path, JSON.stringify(obj));
    } catch (err) {
      console.error("[ERROR]", err);
      Deno.exit(1);
    }
  }
}

export const getConfig = async (): Promise<ConfigJSONType> => {
  const config = new Config();
  return await config.read();
};

export const saveConfig = (obj: ConfigJSONType) => {
  const config = new Config();
  config.save(obj);
};
