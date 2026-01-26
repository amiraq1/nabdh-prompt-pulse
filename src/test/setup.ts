import "@testing-library/jest-dom";
import { vi } from "vitest";

const createQueryBuilder = () => {
  const builder: any = {
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
    then: (resolve: (value: { data: any[]; error: null }) => void) =>
      Promise.resolve(resolve({ data: [], error: null })),
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
