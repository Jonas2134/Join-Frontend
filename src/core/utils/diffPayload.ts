export function buildChangedPayload<T extends Record<string, unknown>>(
  original: Record<string, unknown>,
  updated: T,
): Partial<T> {
  const payload: Partial<T> = {};

  for (const key of Object.keys(updated) as Array<keyof T>) {
    const newVal = updated[key];
    const oldVal = original[key as string];

    if (newVal === undefined) continue;

    if (Array.isArray(newVal) && Array.isArray(oldVal)) {
      if (!arraysEqual(newVal, oldVal)) {
        payload[key] = newVal;
      }
      continue;
    }

    if (isEmpty(newVal)) {
      if (!isEmpty(oldVal)) {
        payload[key] = newVal;
      }
      continue;
    }

    if (newVal !== oldVal) {
      payload[key] = newVal;
    }
  }

  return payload;
}

function isEmpty(value: unknown): boolean {
  return value === "" || value === null || value === undefined;
}

function arraysEqual(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, i) => val === sortedB[i]);
}
