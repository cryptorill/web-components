# Changesets

This directory contains [Changesets](https://github.com/changesets/changesets) — small Markdown files that describe what changed in a pull request and which semantic version bump the change requires.

## Adding a changeset

Every pull request that changes published behavior must include a changeset:

```bash
bun run changeset
```

The command asks for:

1. the bump type — `patch`, `minor`, or `major`;
2. a short summary written for consumers (it becomes the changelog entry).

Commit the generated `.changeset/<random-name>.md` file together with the code change.

## Bump rules

See [`docs/releasing.md`](../docs/releasing.md) for the full semantic versioning policy. In short:

- `major` — breaking changes to components, attributes/properties, events, CSS custom properties, or export paths;
- `minor` — backwards-compatible features and new components;
- `patch` — backwards-compatible fixes, documentation, and internal changes.

Do not edit versions in `package.json` by hand. The release workflow runs `changeset version`, which calculates the next version from the accumulated changesets and updates `CHANGELOG.md`.
