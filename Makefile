install:
	@$(MAKE) deno
	@$(MAKE) command
	@$(MAKE) path

deno:
	@which deno > /dev/null || echo "please install deno. https://deno.land/" | exit 1

command:
	@deno install --name tw \
	--force --allow-net --allow-read \
	index.ts

path:
	@echo "\nensure to set deno to PATH."
	@echo '$$ export PATH=\"~/.deno/bin:$$PATH\" >> ~/.zshrc'
