DENO_PERMISSIONS=--allow-net --allow-write --allow-read --allow-env
DENO_OPTIONS=--import-map=import_map.json --unstable $(DENO_PERMISSIONS)

install:
	@$(MAKE) deno
	@$(MAKE) command
	@$(MAKE) path

deno:
	@which deno > /dev/null || echo "please install deno. https://deno.land/" | exit 1

command:
	deno install --name tw --force $(DENO_OPTIONS) index.ts

path:
	@echo "\nensure to set deno to PATH."
	@echo '$$ export PATH=\"~/.deno/bin:$$PATH\" >> ~/.zshrc'

test:
	deno test $(DENO_OPTIONS)
