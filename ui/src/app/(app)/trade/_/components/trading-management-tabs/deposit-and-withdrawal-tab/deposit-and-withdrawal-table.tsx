"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@brother-terminal/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "@/components/pagination-controls";

const columns = [
  { label: "Time" },
  { label: "Type" },
  { label: "Amount" },
  { label: "Fee	Transaction Hash" },
];

export const DepositAndWithdrawalTable = () => {
  // Placeholder data array (empty for now)
  const rows: any[] = [];
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  return (
    <div className="space-y-3">
      <Table pure>
      <TableHeader className="sticky top-0 left-0 right-0 bg-background z-10">
        <TableRow className="!border-0">
          {columns.map((column, key) => (
            <TableHead
              key={key}
              className="whitespace-nowrap relative after:border-b after:border-white-8 after:absolute after:bottom-0 after:inset-x-0"
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {paged.length === 0 ? <TableRow /> : null}
      </TableBody>
      </Table>
      {total > pageSize && (
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      )}
    </div>
  );
};
