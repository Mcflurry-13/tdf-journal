const r = await request('search', {
  ...input,
  depth,
  questions: plan.questions,
  blocks: bs[i]
});
evidence.push(...r.candidates);
