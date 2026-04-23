# Deployment

This site is prepared for GitHub Pages deployment with `https://zhiyuzheng.com` as the primary domain.

## Primary deployment path

1. Push the repository to GitHub.
2. In the GitHub repository, go to `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. In `Settings -> Pages`, set `Custom domain` to `zhiyuzheng.com`.
5. Configure Aliyun DNS using the GitHub Pages records below.

GitHub recommends adding the custom domain in repository settings before configuring DNS. DNS propagation can take up to 24 hours, and `Enforce HTTPS` may take some time to appear after the domain is configured.

## Aliyun DNS records

For the apex domain `@`, add these `A` records:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

For `www`, add this `CNAME` record:

- `shifengzhicheng.github.io`

Do not use wildcard DNS records.

## Repository setup notes

- The GitHub Actions workflow is defined in `.github/workflows/deploy.yml`.
- The Astro `site` URL is set to `https://zhiyuzheng.com`.
- Canonical metadata, Open Graph URLs, RSS, sitemap, and `robots.txt` are aligned to that primary domain.
- `base` is intentionally not set because this site is intended to live at the domain root.
- `public/CNAME` is not required for a custom GitHub Actions Pages workflow. The source of truth for the domain is `Settings -> Pages -> Custom domain`.

## Optional alternative

Another host can be used later if needed, but GitHub Pages is the canonical deployment path for this repository.
