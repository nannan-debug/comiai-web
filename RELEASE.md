# ComiAI Release Guide

## Naming

- Product name: `ComiAI`
- Repository name: `comiai-web`
- Local development directory: `ComiAI`
- Export package: `ComiAI-vX.Y.Z.zip`
- AI Studio bundle: `ComiAI-vX.Y.Z-for-ai-studio.txt`

## Versioning

Use semantic versioning:

- `vMAJOR.MINOR.PATCH`
- Example: `v1.1.0`, `v1.2.0`, `v1.2.1`

Meaning:

- `MAJOR`: major redesign or incompatible change
- `MINOR`: new feature or workflow upgrade
- `PATCH`: bug fix, style tweak, copy update, small maintenance

## Git Tags

Use only the version number as the tag:

- `vX.Y.Z`

Examples:

- `v1.2.0`
- `v1.2.1`

## Release Commit

Use this format for the release commit:

```text
release: vX.Y.Z
```

Example:

```text
release: v1.2.1
```

## GitHub Release Title

Use this format:

```text
ComiAI vX.Y.Z
```

Example:

```text
ComiAI v1.2.1
```

## Daily Commit Message Rules

Use an English prefix and then write the description in Chinese or mixed Chinese/English if that is clearer.

Common prefixes:

- `feat:` new feature
- `fix:` bug fix
- `refactor:` code refactor
- `style:` UI or visual adjustment
- `docs:` documentation change
- `chore:` config, naming, maintenance
- `perf:` performance improvement

Examples:

```text
feat: 新增拆分镜预览 tab
fix: 修复分镜管理页初始化模式联动
style: 优化提示词配置折叠交互
chore: 统一项目命名为 ComiAI
```

## README Rule

Keep the main title stable:

```md
# ComiAI
```

Write the current version below the title instead of putting it in the title:

```md
当前版本：v1.2.1
```

## Release Checklist

1. Finish the code changes.
2. Commit normal development work with daily commit messages.
3. Update `package.json` version.
4. Update the version text in `README.md`.
5. Commit the release:

```text
release: vX.Y.Z
```

6. Create the tag:

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
```

7. Push the branch and tag:

```bash
git push origin main
git push origin vX.Y.Z
```

8. Create a GitHub Release with title:

```text
ComiAI vX.Y.Z
```

9. Export delivery files if needed:

- `ComiAI-vX.Y.Z.zip`
- `ComiAI-vX.Y.Z-for-ai-studio.txt`

## Quick Template

- Commit:

```text
release: v1.2.1
```

- Tag:

```text
v1.2.1
```

- GitHub Release title:

```text
ComiAI v1.2.1
```

- Export package:

```text
ComiAI-v1.2.1.zip
```
