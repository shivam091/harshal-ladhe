import type { JsonToTsPresetMeta } from "@/interfaces/json-to-ts";

/*
  Curated examples split across both directions — the json-to-ts presets deliberately span a plain
  flat object, a nested object (dedup across two same-shaped properties), an array with a field
  missing from some elements (optional-property inference), and a mixed-type array (union
  inference); the ts-to-json presets exercise nested/array/union/Date/Record types on the way back.
  Each preset only ever supplies the source for its OWN direction — see applyPreset.
*/
export const jsonToTsPresets: JsonToTsPresetMeta[] = [
  {
    slug: "user-profile",
    name: "User Profile",
    direction: "json-to-ts",
    rootName: "User",
    tsSource: "",
    jsonSource: `{
  "id": 1,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "isActive": true,
  "roles": ["admin", "editor"],
  "address": {
    "city": "London",
    "postcode": "E1 6AN"
  }
}`
  },
  {
    slug: "paginated-response",
    name: "Paginated API Response",
    direction: "json-to-ts",
    rootName: "ApiResponse",
    tsSource: "",
    jsonSource: `{
  "page": 1,
  "totalPages": 4,
  "results": [
    { "id": 1, "title": "First post", "publishedAt": "2024-01-15" },
    { "id": 2, "title": "Second post" }
  ]
}`
  },
  {
    slug: "duplicate-addresses",
    name: "Duplicate Nested Shapes",
    direction: "json-to-ts",
    rootName: "Order",
    tsSource: "",
    jsonSource: `{
  "billingAddress": { "street": "1 A St", "city": "London" },
  "shippingAddress": { "street": "2 B St", "city": "Leeds" }
}`
  },
  {
    slug: "mixed-array",
    name: "Mixed-Type Array",
    direction: "json-to-ts",
    rootName: "Root",
    tsSource: "",
    jsonSource: `{
  "values": [1, "two", 3, null]
}`
  },
  {
    slug: "root-array",
    name: "Root-Level Array",
    direction: "json-to-ts",
    rootName: "Products",
    tsSource: "",
    jsonSource: `[
  { "id": 1, "name": "Widget", "price": 9.99 },
  { "id": 2, "name": "Gadget", "price": 19.99 }
]`
  },
  {
    slug: "nested-interfaces",
    name: "Nested Interfaces",
    direction: "ts-to-json",
    rootName: "User",
    jsonSource: "",
    tsSource: `interface Address {
  city: string;
  postcode: string;
}

interface User {
  id: number;
  name: string;
  email?: string;
  role: "admin" | "member";
  tags: string[];
  address: Address;
  createdAt: Date;
}`
  },
  {
    slug: "inline-and-record",
    name: "Inline Object + Record",
    direction: "ts-to-json",
    rootName: "Config",
    jsonSource: "",
    tsSource: `interface Config {
  meta: { version: number; debug: boolean };
  items: Array<string>;
  scores: Record<string, number>;
}`
  },
  {
    slug: "self-referential",
    name: "Self-Referential Tree",
    direction: "ts-to-json",
    rootName: "TreeNode",
    jsonSource: "",
    tsSource: `interface TreeNode {
  label: string;
  children: TreeNode[];
}`
  }
];
