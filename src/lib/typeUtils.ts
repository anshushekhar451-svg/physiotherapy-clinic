import type { Database } from '@/types/database'

export function toInsertData<T extends keyof Database['public']['Tables']>(
  data: any
): Database['public']['Tables'][T]['Insert'] {
  return data as any
}

export function toUpdateData<T extends keyof Database['public']['Tables']>(
  data: any
): Database['public']['Tables'][T]['Update'] {
  return data as any
}
