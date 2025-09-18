"use client";

import { XClose, Settings01, AlertTriangle } from "@untitled-ui/icons-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@brother-terminal/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@brother-terminal/components/ui/table";
import { Token } from "@brother-terminal/components/ui/token";

import { formatPrice } from "../../../utils/price-utils";
import { useAdvancedTriggers } from "../../../hooks/use-advanced-triggers";

export const AdvancedTriggerTable = () => {
  const { columns, triggers, cancelTrigger, editTrigger } = useAdvancedTriggers();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = triggers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return triggers.slice(start, start + pageSize);
  }, [triggers, page]);

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
          <TableHead className="text-center whitespace-nowrap relative after:border-b after:border-white-8 after:absolute after:bottom-0 after:inset-x-0">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paged.map((trigger, key) => (
          <TableRow key={key}>
            <TableCell id="asset-cell">
              <div className="flex items-center gap-1.5">
                <Token pairs={[trigger.baseToken, trigger.quoteToken]} />
                <span className="font-medium">{trigger.symbol}</span>
              </div>
            </TableCell>
            <TableCell id="name-cell">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{trigger.name}</span>
                {trigger.isComplex && (
                  <AlertTriangle className="size-3 text-yellow-500" />
                )}
              </div>
            </TableCell>
            <TableCell id="condition-cell">
              <div className="max-w-xs truncate" title={trigger.condition}>
                {trigger.condition}
              </div>
            </TableCell>
            <TableCell id="action-cell">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                trigger.action.type === "buy" 
                  ? "bg-primary/20 text-primary"
                  : trigger.action.type === "sell"
                  ? "bg-danger/20 text-danger"
                  : "bg-white-8 text-white-48"
              }`}>
                {trigger.action.type.toUpperCase()} {trigger.action.size}
              </span>
            </TableCell>
            <TableCell id="price-range-cell">
              {trigger.priceRange ? 
                `${formatPrice(trigger.priceRange.min)} - ${formatPrice(trigger.priceRange.max)}` : 
                "-"}
            </TableCell>
            <TableCell id="status-cell">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                trigger.status === "active" 
                  ? "bg-primary/20 text-primary"
                  : trigger.status === "triggered"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-white-8 text-white-48"
              }`}>
                {trigger.status}
              </span>
            </TableCell>
            <TableCell id="created-cell">
              {new Date(trigger.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell id="triggered-cell">
              {trigger.triggeredAt ? 
                new Date(trigger.triggeredAt).toLocaleString() : 
                "-"}
            </TableCell>
            <TableCell id="actions-cell" className="text-center">
              <div className="flex items-center justify-center gap-1">
                {trigger.status === "active" && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => editTrigger(trigger.id)}
                  >
                    <Settings01 className="text-white-48 size-4" />
                  </Button>
                )}
                {trigger.status !== "executed" && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => cancelTrigger(trigger.id)}
                  >
                    <XClose className="text-white-48 size-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
      {total > pageSize && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-white-64">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border border-white-12 hover:bg-white-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 rounded border border-white-12 hover:bg-white-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
