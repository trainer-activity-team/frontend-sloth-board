export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  institutions: {
    all: ['institutions'] as const,
    lists: () => [...queryKeys.institutions.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.institutions.all, 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.users.all, 'detail', id] as const,
  },
  classes: {
    all: ['classes'] as const,
    lists: () => [...queryKeys.classes.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.classes.all, 'detail', id] as const,
  },
  contracts: {
    all: ['contracts'] as const,
    lists: () => [...queryKeys.contracts.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.contracts.all, 'detail', id] as const,
  },
  pricingModes: {
    all: ['pricingModes'] as const,
    lists: () => [...queryKeys.pricingModes.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.pricingModes.all, 'detail', id] as const,
  },
} as const
