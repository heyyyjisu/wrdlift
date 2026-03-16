export type Journal = {
  id: string
  content: string
  created_at?: string
  createdAtIso?: string | null
  createdAtDisplay?: string | null
  searchParams: Promise<{
    page?: string
    sort_by?: "created_at"
    query?: string
  }>
}
