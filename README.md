# Flyrank Frontend Internship Capstone

A verification-engineer portfolio site, built as the capstone project for the Flyrank front-end design internship.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Deployed on Vercel with preview deployments on every push

## Pages

- `/` — Home (states the claim)
- `/work` — Work / Case Study (UVM verification environment, APB-AHB bridge)
- `/about` — About
- `/contact` — Contact
- `/health` — Health-check page (renders fetched data)

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Legacy

Earlier plain HTML/CSS/JS drill work (the settings-form prompting exercise) is archived in `/legacy-static` and is not part of the live app.

## AI Chat Tool: `getProjectSpec`

The `/chat` assistant can call a server-side tool to fetch structured
project data instead of answering from memory.

**Tool name:** `getProjectSpec`

**Input schema (Zod):**
```typescript
z.object({
  project: z.string().describe(
    "The project the visitor is asking about, in their own words."
  ),
})
```

**Return shape (on success):**
```typescript
{
  title: string;
  description: string;
  techStack: string[];
  highlights: string[];
  role: string;
}
```

**Error behavior:** if the requested project doesn't match a known entry
(currently: UVM verification environment, APB-AHB bridge), the tool throws
an error, which is surfaced to the UI as a designed `output-error` state
rather than a generic failure.

**UI states rendered:**
- `input-streaming` — "Deciding which project to look up..."
- `input-available` — "Looking up '<project>'..."
- `output-available` — renders `<ProjectSpecCard />`, a real component
  (title, tech stack tags, highlights list)
- `output-error` — red error card showing the actual error message