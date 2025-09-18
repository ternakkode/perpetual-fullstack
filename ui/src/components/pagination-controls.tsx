"use client";

import { ArrowLeft, ArrowRight } from "@untitled-ui/icons-react";
import { Button } from "@brother-terminal/components/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function getPageRange(page: number, total: number, maxCount = 5): Array<number | "..."> {
  if (total <= maxCount) return Array.from({ length: total }, (_, i) => i + 1);

  const range: Array<number | "..."> = [];
  const half = Math.floor(maxCount / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(total, page + half);

  if (start === 1) {
    end = Math.min(total, start + maxCount - 1);
  } else if (end === total) {
    start = Math.max(1, end - maxCount + 1);
  }

  if (start > 1) {
    range.push(1);
    if (start > 2) range.push("...");
  }

  for (let i = start; i <= end; i++) range.push(i);

  if (end < total) {
    if (end < total - 1) range.push("...");
    range.push(total);
  }

  return range;
}

export function PaginationControls({ page, totalPages, onChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-3 text-sm px-3 py-5">
      <span className="text-white-64">Page {page} of {totalPages}</span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 px-2"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ArrowLeft className="size-4" />
        </Button>
        {pages.map((p, idx) => (
          p === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-white-48">…</span>
          ) : (
            <Button
              key={p}
              variant="secondary"
              size="sm"
              className={`h-8 px-3 ${p === page ? "font-semibold bg-white-8 hover:bg-white-8" : ""}`}
              onClick={() => onChange(p)}
            >
              {p}
            </Button>
          )
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="h-8 px-2"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
