import { vi } from "vitest";

export function mockFetchResponse(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Partial<Response>);
}

export function mockFetchSequence(
  responses: Array<{ body: unknown; status: number }>,
) {
  const fn = vi.fn();
  for (const r of responses) {
    fn.mockResolvedValueOnce({
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      json: () => Promise.resolve(r.body),
    } as Partial<Response>);
  }
  return fn;
}
