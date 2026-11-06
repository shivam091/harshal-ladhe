// One animation tool and which capabilities it covers, so the matrix can be read across a row.
export interface ToolRow {
  // Tool name as readers would search for it.
  name: string;
  // Parallel to CAPABILITIES: true where the tool handles that need without extra machinery.
  covers: [boolean, boolean, boolean, boolean, boolean];
}
