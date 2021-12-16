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

export const pp = (text: string) => {
  const dedentText = text.replace(/^[ ]+/i, "");
  console.log(dedentText);
};
