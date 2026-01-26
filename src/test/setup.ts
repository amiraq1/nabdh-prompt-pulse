import "@testing-library/jest-dom";
import { vi } from "vitest";

type QueryResult = { data: unknown[]; error: null };

type QueryBuilder = {
  select: (..._args: unknown[]) => QueryBuilder;
  range: (..._args: unknown[]) => QueryBuilder;
  order: (..._args: unknown[]) => QueryBuilder;
  eq: (..._args: unknown[]) => QueryBuilder;
  textSearch: (..._args: unknown[]) => QueryBuilder;
  limit: (..._args: unknown[]) => QueryBuilder;
  or: (..._args: unknown[]) => QueryBuilder;
  single: () => Promise<{ data: null; error: null }>;
  maybeSingle: () => Promise<{ data: null; error: null }>;
  update: (..._args: unknown[]) => QueryBuilder;
  insert: (..._args: unknown[]) => QueryBuilder;
  delete: (..._args: unknown[]) => QueryBuilder;
  then: PromiseLike<QueryResult>["then"];
};

const createQueryBuilder = (): QueryBuilder => {
  const builder: QueryBuilder = {
    select: () => builder,
    range: () => builder,
    order: () => builder,
    eq: () => builder,
    textSearch: () => builder,
    limit: () => builder,
    or: () => builder,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    update: () => builder,
    insert: () => builder,
    delete: () => builder,
    then: (onfulfilled, onrejected) =>
      Promise.resolve({ data: [], error: null }).then(onfulfilled, onrejected),
  };
  return builder;
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => createQueryBuilder()),
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: null, error: null })),
      signUp: vi.fn(() => Promise.resolve({ data: null, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ data: null, error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "" } })),
      })),
    },
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: null, error: null })),
    },
  },
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
