# GitHub Workflow Contract

Status: Active repo-local contract  
Scope: Dianne’s Place Recovery Services GitHub Actions automation

## Purpose

This repo does not use workflow count as a maturity signal. Workflows exist only when they protect the real product goal: safely operating a public pre-licensed recovery-support website with governed content publishing, legal/licensure boundaries, and SEO/AEO/GEO release surfaces.

## Required Core Workflows

### 1. `.github/workflows/ci.yml`

Required because pull requests and pushes to `main` must prove that the public site can build and that the repo’s hard validators still pass.

Minimum responsibilities:

- check out the repository with `actions/checkout@v4`;
- use Node 24;
- install dependencies with `npm install` unless and until a lockfile policy changes;
- run `npm run build`;
- run `npm run validate:all`;
- run on pull requests, pushes to `main`, and manual dispatch.

### 2. `.github/workflows/content_publish.yml`

Required because this repo has a governed content calendar, approved backlog, self-production lane, release state, public answer feed, sitemap, and proof packet surfaces.

Minimum responsibilities:

- run on schedule and manual dispatch;
- use `contents: write` because it intentionally commits generated release surfaces;
- use a concurrency guard;
- check out full history with `fetch-depth: 0`;
- pull/rebase latest `main` before mutation;
- set `PUBLICATION_DATE` and `SELF_PRODUCE_DATE`;
- run backlog generation, self-production, release state, admin manifest, public answers, sitemap, proof packet, publishing, self-heal, validation, and build steps;
- commit only generated release surfaces;
- avoid governance-file mutation.

## Explicit Non-Goal

The repo is not required to maintain five or more workflows. Additional workflow files are allowed only when they have a real operational purpose. Validation must not require arbitrary workflow count.

## Optional Future Workflows

The following may be added later if they become operationally justified:

- separate SEO/AEO/GEO scheduled audit;
- separate admin/content health audit;
- separate visual/Hallmark proof workflow;
- separate deployment smoke workflow.

Until then, these concerns should remain inside CI or repo-local scripts rather than being split into extra GitHub Actions for appearance.
