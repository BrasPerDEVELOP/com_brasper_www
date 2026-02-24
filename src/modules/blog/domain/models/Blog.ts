export interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  public_id: string
  created_at: string
  updated_at: string
  date: string
  read_time: string
}

export interface BlogPage {
  count: number
  next: string | null
  previous: string | null
  results: Blog[]
}
