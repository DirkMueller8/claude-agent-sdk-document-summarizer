# Building Agents with the Claude Agent SDK — Summary

**Source:** [Building agents with the Claude Agent SDK](https://claude.com/blog/building-agents-with-the-claude-agent-sdk) (Anthropic, published September 29, 2025, ~5 min read)
**Note:** This is a summary in my own words, not a copy of the original. Read the original for the full text, diagrams and code samples.

---

## TL;DR

Anthropic renamed the Claude Code SDK to the **Claude Agent SDK** because the agent harness behind Claude Code turned out to be useful far beyond coding. The core idea is to **give your agent a computer** (terminal, files, search) so it can work the way a person does. The post then structures agent design around a simple feedback loop: **gather context → take action → verify work → repeat**.

---

## Background

- Claude Code started as an internal developer-productivity tool at Anthropic.
- It grew into a general-purpose agent, used internally for deep research, video creation and note-taking, and it now powers almost all of Anthropic's major agent loops.
- That broader role is why the SDK was renamed.

## Core design principle: give Claude a computer

- Programmers rely on a set of everyday tools: finding files, editing them, running code, debugging, and iterating.
- By giving Claude terminal access (bash, file creation, editing and search), it can do the same, and also handle non-coding work such as reading CSVs, searching the web, building visualizations and interpreting metrics.

## What you can build

| Agent type | What it does (examples from the post) |
|---|---|
| **Finance agents** | Understand a portfolio and goals, evaluate investments via APIs, run calculations |
| **Personal assistants** | Book travel, manage calendars, prepare briefs, track context across apps |
| **Customer support agents** | Handle ambiguous tickets, pull user data, call APIs, escalate to humans |
| **Deep research agents** | Search large document collections, cross-reference, synthesize, write reports |

---

## The agent loop

```
Gather context  →  Take action  →  Verify work  →  (repeat)
```

The post illustrates each stage with a running example: an **email agent**.

### 1. Gather context

| Technique | Key idea |
|---|---|
| **Agentic search & the file system** | The folder structure is a form of *context engineering*. Claude uses tools like `grep` and `tail` to pull in only what it needs. Example: store past emails in a `Conversations` folder. |
| **Semantic search** | Faster, but less accurate, harder to maintain and less transparent (requires chunking and embeddings). **Recommendation:** start with agentic search; add semantic search only if you need speed or more variation. |
| **Subagents** | Enable **parallelization** and **context isolation** (each has its own context window and returns only relevant results). Example: several search subagents querying email history at once. |
| **Compaction** | Automatically summarizes earlier messages as the context limit approaches, so long-running agents don't run out of space. |

### 2. Take action

| Technique | Key idea |
|---|---|
| **Tools** | The primary building blocks of execution. They're prominent in the context window, so design them carefully and for context efficiency. Example: `fetchInbox`, `searchEmails`. |
| **Bash & scripts** | General-purpose flexibility. Example: download a PDF attachment, convert it to text and search it. |
| **Code generation** | Code is precise, composable and reusable. Ask: *which tasks would be better expressed as code?* Example: file creation in Claude.ai works by generating Python scripts for Excel, PowerPoint and Word files. |
| **MCP (Model Context Protocol)** | Standardized integrations (Slack, GitHub, Google Drive, Asana, etc.) with authentication handled for you. Example: search Slack for team context or check Asana for task assignments. |

### 3. Verify work

Agents that can check and improve their own output are more reliable because they catch mistakes before those compound.

| Approach | Notes |
|---|---|
| **Defining rules** | The best feedback: clear rules, with an explanation of which failed and why. Linting is the classic example, and generating TypeScript (then linting) gives more feedback layers than plain JavaScript. |
| **Visual feedback** | Screenshots or renders for UI or HTML output. Check layout, styling, content hierarchy and responsiveness. Can be automated with an MCP server like Playwright. |
| **LLM as a judge** | Another model evaluates fuzzy criteria (e.g., tone of an email draft). Less robust and adds latency, so use it only when the extra performance is worth the cost. |

---

## Testing and improving your agent

Look closely at outputs, especially failures, and put yourself in the agent's shoes. Questions to ask:

- **Misunderstands the task?** It may be missing information. Can you restructure your search APIs to make it easier to find?
- **Fails repeatedly?** Can you add a formal rule in tool calls to detect and fix the failure?
- **Can't recover from errors?** Give it more useful or creative tools.
- **Performance varies as features are added?** Build a representative test set (evals) from real customer usage.

---

## Key takeaways

1. **Give agents a computer.** Terminal, files and search make them general-purpose.
2. **Think in loops.** Gather context, act, verify, and repeat.
3. **Start simple.** Prefer agentic search over semantic search at first.
4. **Use subagents** for parallel work and to protect the main context window.
5. **Design tools deliberately.** They shape what the agent will consider doing.
6. **Build in verification.** Rules first, then visual checks, with LLM judges as a last resort.
7. **Evaluate on real failures** and build evals as the agent grows.

---

## Related links from the original post

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Agent SDK documentation](https://docs.claude.com/en/api/agent-sdk/overview)
- [Model Context Protocol](https://modelcontextprotocol.io/)
