import { config } from "https://deno.land/x/dotenv/mod.ts";
import { v4 } from "https://deno.land/std@0.51.0/uuid/mod.ts";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";
import { percentEncode } from "../../util.ts";
import * as queryString from "https://deno.land/x/querystring@v1.0.2/mod.js";

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

    const encodedParamPairs = queryString.stringify(allParams);

    const signatureBaseString = `${this.method}&${percentEncode(this.url)}&${
      percentEncode(encodedParamPairs)
    }`;

    const signingKey = `${percentEncode(this.conf.consumerApiSecret)}&`;

    const signature = hmac(
      "sha1",
      signingKey,
      signatureBaseString,
      "utf8",
      "base64",
    ).toString();

    return percentEncode(signature);
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
