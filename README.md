# Zhiyu Zheng Personal Site

Research-engineering personal site built with Astro and content collections.

## Stack

- Astro
- Markdown content collections
- IBM Plex Sans + Source Serif 4

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run check
```

## Deployment

The primary deployment target is GitHub Pages with the custom domain `https://zhiyuzheng.com`.

Main path:

1. Push to GitHub.
2. In `Settings -> Pages`, set `Source = GitHub Actions`.
3. In `Settings -> Pages`, set `Custom domain = zhiyuzheng.com`.
4. Configure Aliyun DNS:
   - apex `@` `A` records:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - `www` `CNAME`:
     - `shifengzhicheng.github.io`

Notes:

- GitHub recommends adding the custom domain in repository settings before configuring DNS.
- DNS propagation can take up to 24 hours.
- `Enforce HTTPS` may appear after DNS finishes propagating.
- Do not use wildcard DNS records.
- `public/CNAME` is not required for a custom GitHub Actions Pages workflow.

## Content model

- `src/content/projects`: featured and secondary projects
- `src/content/publications`: publication entries
- `src/content/notes`: notes and draft posts

## TODO placeholders to verify

- Google Scholar link
- Public CV PDF
- Secondary email
- TaiWei public link
- Honors and awards
