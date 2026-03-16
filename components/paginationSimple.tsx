import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Props = { page: number; pageCount: number; pageSize: number }

export function PaginationSimple({ page, pageCount, pageSize }: Props) {
  if (!pageCount || pageCount <= 1) return null
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div className="feature-card mt-2 rounded-lg border border-muted bg-indigo-50 p-2 shadow-xl dark:bg-indigo-900/40">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page > 1 ? `?page=${page - 1}&pageSize=${pageSize}` : "#"}
            />
          </PaginationItem>

          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href={`?page=${p}&pageSize=${pageSize}`}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={
                page < pageCount
                  ? `?page=${page + 1}&pageSize=${pageSize}`
                  : "#"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
