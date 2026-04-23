# Zhiyu Zheng Personal Website

This repository is based on the `al-folio` academic website template and customized for Zhiyu Zheng.

## Main files to edit

- `_config.yml`: site-wide metadata and domain settings
- `_pages/about.md`: homepage biography and profile block
- `_data/socials.yml`: public contact and social links
- `_data/cv.yml`: CV data rendered on `/cv/`
- `_bibliography/papers.bib`: publications
- `_projects/`: project pages
- `_news/`: short announcements on the homepage
- `_posts/`: blog posts and notes

## Local development

```bash
bundle install
npm install
bundle exec jekyll serve
```

## Deployment

The repository uses GitHub Actions to build and deploy the site to GitHub Pages.

Custom domain:

- primary domain: `https://zhiyuzheng.com`
- repository setting: `Settings -> Pages`

## Source backup

The pre-migration Astro content was backed up locally to:

`/tmp/zhiyuzheng-migration-backup`
