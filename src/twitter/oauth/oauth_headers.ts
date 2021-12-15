import { config } from "https://deno.land/x/dotenv/mod.ts";
import { v4 } from "https://deno.land/std@0.51.0/uuid/mod.ts";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

type MethodType = "GET" | "POST";

interface Options {
  [key: string]: string;
}

class OAuthHeader {
  method: MethodType;
  url: string;
  options: Options;

  conf = config();
  oauthVersion = "1.0";
  oauthSignatureMethod = "HMAC-SHA1";
  oauthNonce = this.generateNonce();
  oauthTimestamp = this.getCurrentTimestamp();

  constructor(method: MethodType, url: string, options: Options = {}) {
    this.method = method;
    this.url = url;
    this.options = options;
  }

  create() {
    const oauthSignature = this.createSignature();
    const authorizationHeader = [
      "OAuth",
      `oauth_consumer_key="${this.conf.consumerApiKey}",`,
      `oauth_nonce="${this.oauthNonce}",`,
      `oauth_signature="${oauthSignature}",`,
      `oauth_signature_method="${this.oauthSignatureMethod}",`,
      `oauth_timestamp="${this.oauthTimestamp}",`,
      `oauth_version="${this.oauthVersion}"`,
    ].join(" ");

    return new Headers({
      "Authorization": authorizationHeader,
      "Content-Type": "application/json",
    });
  }

  private generateNonce(): string {
    return v4.generate().replace(/-/g, "");
  }

  private getCurrentTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }

  // https://developer.twitter.com/en/docs/authentication/oauth-1-0a/creating-a-signature
  private createSignature() {
    // oauth_token is unnecessary for PIN-Based OAuth
    const allParams: Options = {
      ...this.options,
      "oauth_consumer_key": this.conf.consumerApiKey,
      "oauth_nonce": this.oauthNonce,
      "oauth_signature_method": this.oauthSignatureMethod,
      "oauth_timestamp": this.oauthTimestamp,
      "oauth_version": this.oauthVersion,
    };

    const encodedParamPairs = Object.entries(allParams).map(([key, val]) => {
      const encodedKey = this.percentEncode(key);
      const encodedVal = this.percentEncode(val);
      return `${encodedKey}=${encodedVal}`;
    });
    const sortedParamPairs = encodedParamPairs.sort().join("&");

    const signatureBaseString = `${this.method}&${
      this.percentEncode("https://api.twitter.com/oauth/request_token")
    }&${this.percentEncode(sortedParamPairs)}`;

    const signingKey = `${this.percentEncode(this.conf.consumerApiSecret)}&`;

    const signature = hmac(
      "sha1",
      signingKey,
      signatureBaseString,
      "utf8",
      "base64",
    ).toString();

    return this.percentEncode(signature);
  }

  private percentEncode(val: string) {
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

    const percentEncodedVal = reservedChars.reduce(
      (tot, { match, replace }) => {
        return tot.replace(match, replace);
      },
      encodedVal,
    );

    return percentEncodedVal;
  }
}

export const createOAuthHeaders = (
  method: MethodType,
  url: string,
  options: Options,
) => {
  const headers = new OAuthHeader(method, url, options);
  return headers.create();
};
