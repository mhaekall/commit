# AI Agent Workflow (Commit)

## 1. Role Definition
- **Gemini (CLI Agent):** Acts as the **Integrator, Reviewer, and Executioner**. Responsible for local file management, shell commands, and UI implementation.
- **Claude (Shared Context):** Acts as the **Architect & Logic Expert**. Handles complex Python logic (if any) or deep architectural refactors.
- **You (The Hacker):** The vision-setter and quality controller.

## 2. Agent Skills (Available Tools)
To accelerate development, the following skills are activated:
- **`visual-explainer`**: Generate HTML diagrams for architecture or workflows.
- **`web-artifacts-builder`**: Create complex React/Shadcn UI components quickly.
- **`frontend-design`**: Polish and beautify UI to production-grade standards.
- **`codebase-mapper`**: Map dependencies and structure for new features.

## 3. Development Loop
1. **Research:** Map current state via `docs/` and `grep`.
2. **Strategy:** Share plan in CLI for user approval.
3. **Execution:** Surgical code changes + Automated tests.
4. **Validation:** Lint check and type-checking.

## 4. Memory Bank
The agent uses `.kilocode/rules/memory-bank/` to maintain long-term context across sessions. Update these files after major feature implementation.
