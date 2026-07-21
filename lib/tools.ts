import { tool } from "ai";
import { z } from "zod";

// Structured project data — the "database" this tool queries.
const PROJECTS = {
  "uvm-environment": {
    title: "UVM Verification Environment",
    description:
      "A complete SystemVerilog/UVM verification environment built from scratch, covering the full component stack needed to verify a digital design.",
    techStack: ["SystemVerilog", "UVM", "Questa/VCS (simulation)"],
    highlights: [
      "Generator, driver, monitor, and scoreboard components",
      "Functional coverage groups to track verification completeness",
      "SystemVerilog assertions (SVA) for protocol checking",
    ],
    role: "Designed and implemented independently as a core VLSI verification project.",
  },
  "apb-ahb-bridge": {
    title: "APB-AHB Protocol Bridge",
    description:
      "A bridge design connecting the AMBA AHB (high-performance) and APB (peripheral) buses, enabling communication between fast and low-power peripheral domains.",
    techStack: ["SystemVerilog", "AMBA APB", "AMBA AHB"],
    highlights: [
      "Protocol translation between AHB and APB signaling",
      "Verified alongside the UVM environment for functional correctness",
    ],
    role: "Designed as a protocol-bridging exercise in ARM AMBA bus architectures.",
  },
} as const;

type ProjectKey = keyof typeof PROJECTS;

// Loose keyword matching so the model doesn't need to send an exact key.
function findProject(query: string): ProjectKey | null {
  const q = query.toLowerCase();
  if (q.includes("uvm") || q.includes("verification environment") || q.includes("scoreboard")) {
    return "uvm-environment";
  }
  if (q.includes("apb") || q.includes("ahb") || q.includes("bridge")) {
    return "apb-ahb-bridge";
  }
  return null;
}

export const getProjectSpec = tool({
  description:
    "Fetch structured details about one of Alan's engineering projects (e.g. the UVM verification environment or the APB-AHB bridge). Use this whenever the visitor asks about a specific project by name.",
  inputSchema: z.object({
    project: z
      .string()
      .describe(
        "The project the visitor is asking about, in their own words (e.g. 'UVM environment', 'APB AHB bridge')."
      ),
  }),
  execute: async ({ project }) => {
    const key = findProject(project);
    if (!key) {
      throw new Error(
        `No project matching "${project}" was found. Alan's documented projects are the UVM verification environment and the APB-AHB bridge.`
      );
    }
    return PROJECTS[key];
  },
});