import { z } from 'zod';

const fidelity = z.enum(['reel', 'enonce', 'reconstitue', 'illustratif']);
const tags = z.array(z.string().min(1)).min(1);
const base = {
  id: z.string().min(1),
  prompt: z.string().min(5),
  explain: z.string().min(5),
  tags,
  source: z.enum(['enonce', 'derive']),
};

export const questionSchema = z.union([
  z.object({ ...base, kind: z.literal('single'), options: z.array(z.string()).min(2), answer: z.number().int().min(0) })
    .refine((q) => q.answer < q.options.length, 'answer hors des options'),
  z.object({ ...base, kind: z.literal('multi'), options: z.array(z.string()).min(2), answers: z.array(z.number().int()).min(1) })
    .refine((q) => q.answers.every((a) => a < q.options.length), 'answers hors des options'),
  z.object({ ...base, kind: z.literal('input'), accept: z.array(z.string().min(1)).min(1), placeholder: z.string().optional() }),
  z.object({ ...base, kind: z.literal('order'), items: z.array(z.string()).min(3) }),
]);

const node = z.object({
  id: z.string(), label: z.string().optional(),
  kind: z.enum(['router', 'switch', 'pc', 'server', 'frswitch', 'cloud']),
  x: z.number(), y: z.number(), role: z.string().optional(), info: z.array(z.string()).optional(),
});

export const topologySchema = z.object({
  width: z.number().positive(), height: z.number().positive(),
  nodes: z.array(node).min(2),
  links: z.array(z.object({ a: z.string(), b: z.string(), label: z.string().optional(), kind: z.enum(['serial', 'ethernet', 'tunnel', 'virtual']).optional() })),
  zones: z.array(z.object({ label: z.string(), x: z.number(), y: z.number(), w: z.number(), h: z.number(), tone: z.string() })).optional(),
  caption: z.string().optional(),
}).superRefine((t, ctx) => {
  const ids = new Set(t.nodes.map((n) => n.id));
  for (const l of t.links) {
    if (!ids.has(l.a) || !ids.has(l.b)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `lien vers un nœud inconnu : ${l.a} ↔ ${l.b}` });
  }
});

export const stepSchema = z.object({
  id: z.string(), device: z.string(), title: z.string(), goal: z.string(),
  commands: z.array(z.object({ prompt: z.string().min(2), cmd: z.string().min(1), alt: z.array(z.string()).optional() })).min(1),
  output: z.string().optional(), outputFidelity: fidelity.optional(),
  explain: z.string().min(5), hint: z.string().min(3),
});

export const compareSchema = z.object({
  id: z.string(), title: z.string(), context: z.string(),
  wrong: z.object({ config: z.string(), result: z.string() }),
  right: z.object({ config: z.string(), result: z.string() }),
  lesson: z.string(),
  challenge: z.object({ symptom: z.string(), options: z.array(z.string()).min(2), answer: z.number().int() })
    .refine((c) => c.answer < c.options.length, 'answer hors des options'),
});

export const tpSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  code: z.string(), title: z.string(), subtitle: z.string(),
  subject: z.enum(['tech-wan', 'routage']),
  theme: z.enum(['mpls', 'routage', 'services', 'vpn', 'frame-relay']),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  duration: z.number().int().positive(),
  tools: z.array(z.string()).min(1), equipment: z.array(z.string()).min(1),
  fidelity, summary: z.string().min(20), scenario: z.string().min(20),
  objectives: z.array(z.string()).min(2), prerequisites: z.array(z.string()),
  topology: topologySchema,
  learn: z.array(z.object({
    title: z.string(), body: z.array(z.string()).min(1), points: z.array(z.string()).optional(), code: z.string().optional(),
    callout: z.object({ tone: z.enum(['info', 'warn', 'tip']), text: z.string() }).optional(),
  })).min(2),
  steps: z.array(stepSchema).min(3),
  quiz: z.array(questionSchema).min(5),
  compare: z.array(compareSchema).min(1),
  sims: z.array(z.string()),
  ap: z.object({ file: z.string().startsWith('sims/'), scenes: z.array(z.string()).min(5) }),
  sources: z.array(z.object({ label: z.string(), file: z.string() })).min(1),
  notes: z.array(z.string()),
  glossary: z.array(z.string()),
});
