// Supabase removed - using frontend-only approach
// This file exists as a stub for backward compatibility

export type Json = any;

export type Database = {
  public: {
    Tables: Record<string, any>;
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums: Record<string, any>;
    CompositeTypes: Record<string, any>;
  };
};

// Stub supabase client for backward compatibility
export const supabase = {
  from: () => ({
    select: () => ({ 
      eq: () => ({ 
        order: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => ({ 
      eq: () => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({ 
      eq: () => Promise.resolve({ error: null })
    })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithWeb3: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase auth disabled') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  functions: {
    invoke: () => Promise.resolve({ data: null, error: new Error('Supabase functions disabled') })
  },
  removeChannel: () => {},
  channel: () => ({
    on: () => ({
      subscribe: () => {}
    })
  })
};

export function createAdminClient() {
  return supabase;
}