import { ensureDir } from "https://deno.land/std@0.117.0/fs/mod.ts";

export type ConfigJSON = {
  "oauth_token"?: string;
  "oauth_token_secret"?: string;
  "screen_name"?: string;
  "user_id"?: string;
};

class Config {
  dirPath = `${Deno.env.get("HOME")}/.config/tw`;
  fileName = "tw.json";
  path = `${this.dirPath}/${this.fileName}`;

  async read(): Promise<ConfigJSON | false> {
    try {
      return JSON.parse(await Deno.readTextFile(this.path));
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) return false;
      throw err;
    }
  }

  save(obj: ConfigJSON) {
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

export const getConfig = async (): Promise<false | ConfigJSON> => {
  const config = new Config();
  return await config.read();
};

export const saveConfig = (obj: ConfigJSON) => {
  const config = new Config();
  config.save(obj);
};
