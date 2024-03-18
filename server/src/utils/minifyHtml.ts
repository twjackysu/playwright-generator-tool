import htmlMinifier from "html-minifier";

export function minifyHtml(html: string): string {
  const options: htmlMinifier.Options = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    decodeEntities: true,
    html5: true,
    ignoreCustomComments: [],
    minifyCSS: true,
    minifyJS: false, // Set to true if you want to minify JS as well
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
  };

  return htmlMinifier.minify(html, options);
}
