# Releasing `@cryptorill/web-components`

This document defines how versions are chosen and how a release reaches npm.

## Semantic versioning policy

The package follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html). Once a version is published it is immutable, so the version number is the contract consumers use to decide whether an upgrade is safe.

| Bump    | Use for                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `major` | Any breaking change to the public API: removing or renaming a component tag, attribute/property, event name or payload, CSS custom property, export path, or changing runtime behavior in a way that can break existing consumers. |
| `minor` | Backwards-compatible additions: a new component, a new optional attribute/property, a new event, a new export, or new opt-in behavior.                                                                                             |
| `patch` | Backwards-compatible fixes: bug fixes, performance improvements, documentation, internal refactoring, dependency updates that do not change the public contract.                                                                   |

Additional rules:

- A breaking change must never ship as a `minor` or `patch` release.
- Deprecate public API in a `minor` release first; remove it in the next `major` release.
- CSS custom properties are part of the public API. Renaming or removing a documented `--cryptorill-*` token is a breaking change.
- Generated type names and export paths (`@cryptorill/web-components/components/*`, tree-shakeable entry points) are part of the public API.
- Pre-release versions use Changesets pre mode, for example `2.0.0-next.0`; they are published under the `next` dist-tag and are not installed by default.
- `0.x` versions are not used for this package. After `1.0.0` a breaking change means `2.0.0`.

## Changesets workflow

Every pull request that changes published behavior includes a changeset:

```bash
bun run changeset
```

Choose the bump type using the table above and write a consumer-facing summary. Commit the generated `.changeset/*.md` file with the code.

When the pull request is merged to `main`:

1. The **Release** GitHub Actions workflow runs `changeset version`, which:
   - calculates the next version from all pending changesets;
   - updates `version` in `package.json`;
   - updates `CHANGELOG.md`;
   - deletes consumed changeset files.
2. The workflow opens or updates a pull request titled `chore(release): version packages`.
3. Merging that pull request makes the workflow run `changeset publish`, which:
   - builds the package through the `prepack` script;
   - publishes to `https://registry.npmjs.org/` using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), with provenance attestations generated automatically;
   - creates a git tag such as `@cryptorill/web-components@1.2.0`.

If `1.0.0` is not on the registry yet, complete the one-time bootstrap publish described below before trusted publishing can be configured. After that, `changeset publish` publishes only when version changes are pending.

Never edit `version` in `package.json` by hand and never run `npm version` locally for a release.

## Repository and npm setup

Publishing uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers): the release workflow authenticates with a short-lived OIDC token issued by GitHub Actions, so there is no long-lived npm token or `NPM_TOKEN` secret to rotate.

One-time setup before the first automated release:

1. Create the `@cryptorill` npm organization (or make sure the publishing account has access to the scope).
2. Bootstrap the first publish. Trusted publishers can only be configured for a package that already exists on the npm registry (`npm trust` fails with "package must exist"), so `@cryptorill/web-components` must be published once with a traditional credential. From the package directory:
   ```bash
   npm login                # account with access to the @cryptorill scope and 2FA enabled
   bun install
   npm publish --access public
   ```
   The `prepack` script builds `dist/` and `loader/`, and `prepublishOnly` runs the unit tests. This initial publish is the only one that needs a token-based credential; everything afterwards uses OIDC. If you prefer not to publish from a workstation, temporarily add `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` to the publish step in the release workflow for this single publish and remove it immediately afterwards.
3. Configure the trusted publisher, either on [npmjs.com](https://www.npmjs.com/) under **Packages → @cryptorill/web-components → Settings → Trusted publishing** or from the package directory with the npm CLI (requires npm ≥ 11.15.0):
   ```bash
   npm trust github \
     --file release.yml \
     --repo cryptorill/web-components \
     --allow-publish
   ```
   The equivalent UI fields are:
   - **Organization or user:** `cryptorill`
   - **Repository:** `cryptorill-web-components`
   - **Workflow filename:** `release.yml` (filename only, including the `.yml` extension)
   - **Allowed actions:** allow **npm publish**. Configurations created after September 3, 2026 default to staged publishing only, so this must be selected explicitly for `changeset publish` to work.
4. Complete a successful trusted publish within 2 days of creating the configuration. The first successful publish validates it and binds it to the repository's immutable identity; otherwise the configuration expires and must be recreated. Because `changeset publish` only publishes when a new version is due, add a small `patch` changeset and merge the resulting release pull request to validate the configuration promptly.
5. Recommended after the first OIDC publish: in **Settings → Publishing access**, select **Require two-factor authentication and disallow tokens**, then revoke the old `NPM_TOKEN` secret and any unused automation tokens. This does not affect trusted publishing, which uses OIDC.
6. Confirm the repository is public if you want npm provenance attestations. Provenance is generated automatically for trusted publishes from public repositories and public packages. The release workflow already requests `id-token: write`, and `publishConfig.access` is `public`.

The package is published publicly because scoped packages default to restricted access.

The npm CLI must be at least `11.5.1` on Node `22.14.0` or newer, and publishing must run on GitHub-hosted runners (self-hosted runners are not supported). [`release.yml`](../.github/workflows/release.yml) uses Node 24 and installs the latest npm before publishing. Do not add `NODE_AUTH_TOKEN` or `NPM_TOKEN` to the publish step: the npm CLI detects the OIDC environment automatically and no write token should be exposed. If private dependencies must be installed, provide a read-only granular access token only on that install step.

## Manual dry run

Validate what will be uploaded without publishing:

```bash
bun run build
npm pack --dry-run
```

The `files` field in `package.json` limits the tarball to `dist/`, `loader/`, and `CHANGELOG.md` (npm always adds `package.json`, `README.md`, and `LICENSE`).

To inspect the package entry points:

```bash
node -e "const p=require('./package.json'); console.log(p.name, p.version); console.log(p.exports)"
```

## Hotfixes

For an urgent fix:

1. Branch from `main`.
2. Apply the fix and add a `patch` changeset (`bun run changeset`).
3. Open and merge the pull request.
4. Merge the release pull request created by the workflow.

If a broken version must be removed, prefer deprecating it (`npm deprecate @cryptorill/web-components@<version> "<reason>"`) and publishing a fixed version. `npm unpublish` is only a last resort within npm's 72-hour window.
