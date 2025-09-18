"use client";

import { XClose, Clock } from "@untitled-ui/icons-react";
import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "@/components/pagination-controls";

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
import { useScheduledOrders } from "../../../hooks/use-scheduled-orders";

export const ScheduledOrderTable = () => {
  const { columns, scheduledOrders, cancelScheduledOrder } = useScheduledOrders();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = scheduledOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return scheduledOrders.slice(start, start + pageSize);
  }, [scheduledOrders, page]);

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
        {paged.map((order, key) => (
          <TableRow key={key}>
            <TableCell id="asset-cell">
              <div className="flex items-center gap-1.5">
                <Token pairs={[order.baseToken, order.quoteToken]} />
                <span className="font-medium">{order.symbol}</span>
              </div>
            </TableCell>
            <TableCell
              id="side-cell"
              className={order.side === "buy" ? "text-primary" : "text-danger"}
            >
              {order.side.toUpperCase()}
            </TableCell>
            <TableCell id="type-cell">
              {order.type}
            </TableCell>
            <TableCell id="size-cell">
              {order.size.toFixed(6)}
            </TableCell>
            <TableCell id="price-cell">
              {order.price ? formatPrice(order.price) : "Market"}
            </TableCell>
            <TableCell id="trigger-cell">
              {order.triggerCondition}
            </TableCell>
            <TableCell id="scheduled-time-cell">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3 text-white-48" />
                {new Date(order.scheduledTime).toLocaleString()}
              </div>
            </TableCell>
            <TableCell id="status-cell">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                order.status === "pending" 
                  ? "bg-yellow-500/20 text-yellow-500"
                  : order.status === "executed"
                  ? "bg-primary/20 text-primary"
                  : "bg-white-8 text-white-48"
              }`}>
                {order.status}
              </span>
            </TableCell>
            <TableCell id="time-remaining-cell">
              {order.status === "pending" ? order.timeRemaining : "-"}
            </TableCell>
            <TableCell id="actions-cell" className="text-center">
              {order.status === "pending" && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => cancelScheduledOrder(order.id)}
                >
                  <XClose className="text-white-48 size-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
      {total > pageSize && (
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      )}
    </div>
  );
};
