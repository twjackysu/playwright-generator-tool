function minifyHTML(html: string) {
  // space
  html = html.replace(/\s+/g, " ");

  // comments
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  // new lines
  html = html.replace(/\n/g, "");

  return html;
}

export default minifyHTML;
