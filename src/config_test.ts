import { dirname, fromFileUrl, join, resolve } from "path/mod.ts";
import { assertEquals } from "testing/asserts.ts";
import { Config } from "./config.ts";

const moduleDir = dirname(fromFileUrl(import.meta.url));
const testdataDir = resolve(moduleDir, "testdata");

Deno.test("existsIfConfigExist", () => {
  const baseDir = join(testdataDir, "exists_if_config_exist");
  const testFile = join(baseDir, "test.json");
  Deno.mkdirSync(baseDir, { recursive: true });
  Deno.writeTextFileSync(testFile, JSON.stringify({}));

  const config = new Config({ path: testFile });
  assertEquals(config.exists(), true);

  Deno.removeSync(baseDir, { recursive: true });
});

Deno.test("existsIfConfigNotExist", () => {
  const testFile = join(testdataDir, "exists_if_config_not_exist", "test.json");

  const config = new Config({ path: testFile });
  assertEquals(config.exists(), false);
});

Deno.test("saveToUpdateIfConfigExist", () => {
  const baseDir = join(testdataDir, "save_to_update_if_config_exist");
  const testFile = join(baseDir, "test.json");
  Deno.mkdirSync(baseDir, { recursive: true });
  Deno.writeTextFileSync(
    testFile,
    JSON.stringify({ consumer_key: "not_overridden" }),
  );

  const config = new Config({ path: testFile });
  config.save({ "user_id": "test" });
  const json = JSON.parse(Deno.readTextFileSync(testFile));
  assertEquals(json.consumer_key, "not_overridden");
  assertEquals(json.user_id, "test");

  Deno.removeSync(baseDir, { recursive: true });
});
