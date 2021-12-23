import { hmac } from "hmac";
import * as queryString from "querystring";
import { percentEncode } from "../../util.ts";
import { Config } from "../../config.ts";

type MethodType = "GET" | "POST";

interface Options {
  [key: string]: string;
}

class OAuthHeader {
  method: MethodType;
  url: string;
  options: Options;

  config: Config;
  oauthVersion = "1.0";
  oauthSignatureMethod = "HMAC-SHA1";
  oauthNonce = this.generateNonce();
  oauthTimestamp = this.getCurrentTimestamp();

  constructor(
    method: MethodType,
    url: string,
    options: Options = {},
    config: Config,
  ) {
    this.method = method;
    this.url = url;
    this.options = options;
    this.config = config;
  }

  create() {
    const oauthSignature = this.createSignature();
    const authorizationHeader = [
      "OAuth",
      `oauth_consumer_key="${this.config.consumerKey}",`,
      `oauth_nonce="${this.oauthNonce}",`,
      `oauth_signature="${oauthSignature}",`,
      `oauth_signature_method="${this.oauthSignatureMethod}",`,
      `oauth_timestamp="${this.oauthTimestamp}",`,
      `oauth_version="${this.oauthVersion}"`,
    ];
    if (this.config.accessToken) {
      authorizationHeader.push(`, oauth_token="${this.config.accessToken}"`);
    }

    return new Headers({
      "Authorization": authorizationHeader.join(" "),
      "Content-Type": "application/json",
      "Host": "api.twitter.com",
      "Accept": "*/*",
    });
  }

  private generateNonce(): string {
    return crypto.randomUUID().replace(/-/g, "");
  }

  private getCurrentTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }

  // https://developer.twitter.com/en/docs/authentication/oauth-1-0a/creating-a-signature
  private createSignature() {
    // oauth_token is unnecessary for PIN-Based OAuth
    const allParams: Options = {
      ...this.options,
      "oauth_consumer_key": this.config.consumerKey!,
      "oauth_nonce": this.oauthNonce,
      "oauth_signature_method": this.oauthSignatureMethod,
      "oauth_timestamp": this.oauthTimestamp,
      "oauth_version": this.oauthVersion,
    };
    if (this.config.accessTokenSecret) {
      Object.assign(allParams, { "oauth_token": this.config.accessToken });
    }

    const encodedParamPairs = queryString.stringify(allParams);

    const signatureBaseString = `${this.method}&${percentEncode(this.url)}&${
      percentEncode(encodedParamPairs)
    }`;
    const signingKey = this.config.accessTokenSecret
      ? `${percentEncode(this.config.consumerSecret!)}&${
        percentEncode(this.config.accessTokenSecret)
      }`
      : `${percentEncode(this.config.consumerSecret!)}&`;
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
  config: Config,
) => {
  const headers = new OAuthHeader(
    method,
    url,
    options,
    config,
  );
  return headers.create();
};
