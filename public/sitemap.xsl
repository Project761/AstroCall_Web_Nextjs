<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #444;
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .wrap {
            max-width: 980px;
            margin: 0 auto;
            padding: 24px 20px 40px;
          }
          h1 {
            font-size: 24px;
            font-weight: 700;
            color: #111;
            margin: 0 0 8px;
            text-align: center;
          }
          .intro {
            text-align: center;
            margin: 0 0 24px;
            color: #555;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ddd;
            background: #fff;
          }
          thead th {
            background: #7ad03a;
            color: #fff;
            font-weight: 700;
            text-align: left;
            padding: 12px 14px;
            border: 1px solid #6fbf34;
            font-size: 14px;
          }
          thead th:last-child {
            text-align: right;
            width: 160px;
          }
          tbody td {
            padding: 10px 14px;
            border: 1px solid #e5e5e5;
            font-size: 13px;
            vertical-align: top;
            word-break: break-all;
          }
          tbody tr:nth-child(even) {
            background: #f7f7f7;
          }
          tbody tr:nth-child(odd) {
            background: #fff;
          }
          tbody td:last-child {
            text-align: right;
            white-space: nowrap;
            color: #666;
          }
          a {
            color: #0073aa;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>XML Sitemap</h1>
          <p class="intro">
            <xsl:choose>
              <xsl:when test="sitemap:sitemapindex">
                Total URLs: <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/>
              </xsl:when>
              <xsl:otherwise>
                Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
              </xsl:otherwise>
            </xsl:choose>
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Updated at</th>
              </tr>
            </thead>
            <tbody>
              <xsl:choose>
                <xsl:when test="sitemap:sitemapindex">
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <xsl:sort select="sitemap:loc"/>
                    <tr>
                      <td>
                        <a href="{sitemap:loc}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <xsl:sort select="sitemap:loc"/>
                    <tr>
                      <td>
                        <a href="{sitemap:loc}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </xsl:otherwise>
              </xsl:choose>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
