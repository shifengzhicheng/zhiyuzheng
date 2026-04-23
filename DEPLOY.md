# Deployment

This site is prepared for custom-domain deployment with `https://zhiyuzheng.com` as the primary domain.

## Recommended path

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. In Vercel, add both `zhiyuzheng.com` and `www.zhiyuzheng.com` under `Domains`.
4. Use `zhiyuzheng.com` as the primary domain in Vercel.
5. Copy the exact DNS records shown by Vercel into Aliyun DNS.

## Important constraint

Do not hardcode or guess DNS target values in the repository.

The required DNS records must come from the hosting dashboard after the domain is added. Vercel may show different values depending on the project and verification state, so the repo intentionally avoids storing any DNS targets.

## Notes

- The Astro `site` URL is set to `https://zhiyuzheng.com`.
- Canonical metadata, Open Graph URLs, RSS, sitemap, and `robots.txt` are aligned to that primary domain.
- `www.zhiyuzheng.com` should be added in Vercel as a secondary domain and redirected there by platform configuration if desired.
