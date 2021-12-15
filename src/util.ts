export const percentEncode = (val: string): string => {
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
};

type Object = { [key: string]: string };

export const toQueryParams = (
  object: Object,
  sort = false,
): string => {
  const strings = Object.entries(object).map(([key, val]) => {
    const encodedKey = percentEncode(key);
    const encodedVal = percentEncode(val);
    return `${encodedKey}=${encodedVal}`;
  });
  if (sort) strings.sort();
  return strings.join("&");
};
