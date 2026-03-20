import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="relative z-10 mx-auto mt-20 flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-20">
      <div className="feature-card rounded-lg bg-card p-6 shadow-xl dark:bg-card">
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Getting your journals</EmptyTitle>
            <EmptyDescription>
              Please wait while we bring you your journals 🤎
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  )
}
