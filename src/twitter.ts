import { v4 } from "https://deno.land/std@0.51.0/uuid/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

interface Options {
  [key: string]: string;
}

const conf = config();
const oauthVersion = "1.0";
const oauthSignatureMethod = "HMAC-SHA1";

const createAuthorizationHeader = (
  method: "GET" | "POST",
  url: string,
  options: Options = {},
) => {
  const oauthNonce = generateNonce();
  const oauthTimestamp = getCurrentTimestamp();
  const oauthSignature = createSignature(
    oauthNonce,
    oauthTimestamp,
    {
      options,
      method,
      url,
    },
  );

  const authString = [
    "OAuth",
    `oauth_consumer_key=${conf.consumerApiKey},`,
    `oauth_nonce=${oauthNonce},`,
    `oauth_signature=${oauthSignature},`,
    `oauth_signature_method=${oauthSignatureMethod},`,
    `oauth_timestamp=${oauthTimestamp},`,
    // `oauth_token=${oauthToken},`,
    `oauth_version=${oauthVersion}`,
  ].join(" ");
  const authorizationHeader = percentEncode(authString);
  return authorizationHeader;
};

const generateNonce = (): string => {
  return v4.generate().replace(/-/g, "");
};

const getCurrentTimestamp = (): string => {
  return Math.floor(new Date().valueOf() / 1000).toString();
};

const createSignature = (
  oauthNonce: string,
  oauthTimestamp: string,
  { method, url, options }: {
    method: "GET" | "POST";
    url: string;
    options: Options;
  },
): string => {
  const params: Options = {
    "oauth_consumer_key": conf.consumerApiKey,
    "oauth_nonce": oauthNonce,
    "oauth_signature_method": oauthSignatureMethod,
    "oauth_timestamp": oauthTimestamp,
    // "oauth_token": oauthToken,
    "oauth_version": oauthVersion,
    ...options,
  };

  const paramPairs = Object.entries(params).map(([key, val]) =>
    `${key}=${val}`
  );
  const encodedParamPairs = percentEncode(paramPairs.sort().join("&"));

  const signatureBaseString = percentEncode(
    `${method}&${url}&${encodedParamPairs}`,
  );

  const signingKey: string = percentEncode(
    `${conf.consumerApiSecret}&${oauth_token_secret}`,
  );

  const hmacSha1: string = hmac(
    "sha1",
    signingKey,
    signatureBaseString,
    "utf8",
    "base64",
  ).toString();

  return hmacSha1;
};

const percentEncode = (val: string) => {
  const encodedVal: string = encodeURIComponent(val);

  // Adjust for RFC 3986 section 2.2 Reserved Characters
  const reservedChars: { match: RegExp; replace: string }[] = [
    { match: /\!/g, replace: "%21" },
    { match: /\#/g, replace: "%23" },
    { match: /\$/g, replace: "%24" },
    { match: /\&/g, replace: "%26" },
    { match: /\'/g, replace: "%27" },
    { match: /\(/g, replace: "%28" },
    { match: /\)/g, replace: "%29" },
    { match: /\*/g, replace: "%2A" },
    { match: /\+/g, replace: "%2B" },
    { match: /\,/g, replace: "%2C" },
    { match: /\//g, replace: "%2F" },
    { match: /\:/g, replace: "%3A" },
    { match: /\;/g, replace: "%3B" },
    { match: /\=/g, replace: "%3D" },
    { match: /\?/g, replace: "%3F" },
    { match: /\@/g, replace: "%40" },
    { match: /\[/g, replace: "%5B" },
    { match: /\]/g, replace: "%5D" },
  ];

  const percentEncodedVal = reservedChars.reduce((tot, { match, replace }) => {
    return tot.replace(match, replace);
  }, encodedVal);

  return percentEncodedVal;
};

// テスト実行

const requestTokenUrl =
  "https://api.twitter.com/oauth/request_token?oauth_callback=oob";
const url = requestTokenUrl;
const method = "POST";

const authHeader = createAuthorizationHeader(method, url);

const headers = new Headers({
  "Authorization": authHeader,
  "Content-Type": "application/json",
});

const requestTokenReq = new Request(url, {
  method,
  headers,
});
console.log(requestTokenReq);

const response = await fetch(requestTokenReq);
console.log(await response.json());
