# tw

## Installation

Require to setup deno.

https://deno.land/manual@main/getting_started/installation

```sh
$ git clone https://github.com/yoshikouki/tw.git && cd tw && make install
#> ✅ Successfully installed tw
#> /Users/yoshikouki/.deno/bin/tw
#>
#> ensure to set deno to PATH.
#> $ export PATH="~/.deno/bin:$PATH" >> ~/.zshrc

$ export PATH="~/.deno/bin:$PATH" >> ~/.zshrc
```

or

```
# one liner install command (WIP)
```

## Setup

### Using trial keys (unsafe)

```
$ tw

#> [WARNING] Your consumer_key or consumer_secret for Twitter API is not found.
#> Sure to use trial key what is not secure because it is published.
#> See README for details.
#> https://github.com/yoshikouki/tw
#>
#> Use the trial key? [y/N]
```

### Using Your keys

Get consumer_key and consumer_secret for Twitter API.
And ensure to enable OAuth 1.0a for user authentication settings.

https://developer.twitter.com/en/docs/authentication/oauth-1-0a/api-key-and-secret

```
$ CONSUMER_KEY=consumer_key CONSUMER_SECRET=consumer_secret tw
```

supported for .env file

```
$ mv .env-sample .env # and update
$ tw
```

## Usage

### tweet

```sh
$ tw tweet by tw!!1
```

### Check Timeline

```sh
$ tw -l
```

### Change Twitter Account #WIP

```sh
# change twitter account
$ tw --account tw_test

# show register account list
$ tw --accounts
```
