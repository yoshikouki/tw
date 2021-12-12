install:
	@$(MAKE) deno
	@deno install --force --name tw index.ts
	@$(MAKE) path

deno:
	@which deno > /dev/null || echo "please install deno. https://deno.land/" | exit 1

path:
	@echo "\nensure to set deno to PATH."
	@echo '$$ export PATH=\"~/.deno/bin:$$PATH\" >> ~/.zshrc'
