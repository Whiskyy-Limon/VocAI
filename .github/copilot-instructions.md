# GitHub Copilot Instructions for this Repository

**Purpose:** Help AI coding agents become productive quickly in this repo by describing discovery steps, developer workflows, and repo-specific patterns. Update this file when the repository layout or build/test commands change.

**Repository scan (automated):** I ran an initial discovery scan from `c:\Users\user\Desktop\Tesis`.

- Summary: no language manifests (`package.json`, `pyproject.toml`, `requirements.txt`, `pom.xml`, `*.sln`, `Cargo.toml`) were found, and there are no GitHub workflow files under `.github/workflows`.
- Current visible entries: the `.github` directory (contains this file). No `src/`, `README.md`, or obvious code directories detected.

Because this repository currently has no code or manifests, these instructions focus on how an AI agent should proceed when repository content is missing and what to ask maintainers.

Quick discovery commands (what I ran locally):

```powershell
Set-Location 'c:\Users\user\Desktop\Tesis'
Get-ChildItem -Recurse -File -Include package.json,pyproject.toml,requirements.txt,pom.xml,*.sln,Dockerfile,docker-compose.yml,README.md -ErrorAction SilentlyContinue | Format-Table FullName
if (Test-Path .github\workflows) { Get-ChildItem -Path .github\workflows -File } else { Write-Host 'No workflows' }
Get-ChildItem -Directory | Select-Object Name,FullName
```

If you add files, re-run the commands above to populate this document with concrete examples.

Actionable guidance for AI agents (given current empty repository):

- Immediate next steps: request the maintainer to either add a README and/or manifests, or provide a short reply describing the project's language, entry points, and build/test commands.
- If the maintainer cannot respond, attempt a language-detection pass by file extension across the repo (search for `.py`, `.js`, `.ts`, `.cs`, `.java`, `.go`, `.rs`) and create a draft `README.md` and simple `requirements.txt` / `package.json` scaffolding when safe to do so — but ask before committing scaffolds.
- Prefer minimal, reversible changes: open a PR that adds a `README.md` and a short CONTRIBUTING section asking for canonical commands and environment variables.

Checklist for when repo has content (how to proceed then):

- Identify service boundaries: look for top-level folders like `api/`, `web/`, `worker/` and check each for its own manifest (`package.json`, `pyproject.toml`, etc.).
- Find entry points: look for `main.*`, `app.py`, `server.js`, `index.js`, `Program.cs`, or `src/index.ts`.
- Detect persistence and integrations: search for imports/usages of `psycopg2`, `sqlalchemy`, `pg`, `typeorm`, `mongoose`, `redis`, `rabbitmq`, `kafka`.
- Locate CI: check `.github/workflows/*.yml` for build/test steps to mirror locally.

Developer workflows (what to capture once code exists):

- Build commands: capture exact scripts from `package.json` or equivalents (e.g., `npm run build`, `dotnet build`, `mvn package`).
- Test commands: capture how tests are run (e.g., `npm test`, `pytest`, `dotnet test`).
- Local dev/run: capture commands to run services locally (e.g., `npm run start`, `python -m myapp`, `dotnet run --project src/MyApp`).

When merging an existing `.github/copilot-instructions.md` (if one is later discovered):

- Preserve any project-specific commands and CI notes. Replace stale paths with detection commands and add a TODO for maintainers to confirm.

Questions for maintainers (please answer to make agents productive):

- What language(s) does this repo use? Where are the main entry points?
- What are the canonical build/test commands for each service/folder?
- Are there environment variables or secrets required for local runs? If yes, please add a `.env.example` or document them in `README.md`.

If you'd like, I can now:

- Re-run the discovery commands after you add project files, or
- Create a minimal `README.md` and a `ISSUE_TEMPLATE` that asks maintainers for the missing information (I can draft these and open a PR if you want).

---

If you want me to proceed with creating a `README.md` scaffold or opening an issue/PR, tell me which option you prefer and any preferred content to include.