"use client";

import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "@/components/pagination-controls";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@brother-terminal/components/ui/table";
import { Token } from "@brother-terminal/components/ui/token";
import { cn } from "@brother-terminal/lib/utils";

import { formatPrice } from "../../../utils/price-utils";
import { useOrderHistories } from "../../../hooks/use-order-histories";

export const OrderHistoryTable = () => {
  const { columns, orderHistories, isLoadingUserFills } = useOrderHistories();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = orderHistories.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return orderHistories.slice(start, start + pageSize);
  }, [orderHistories, page]);

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
        {isLoadingUserFills ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-white-64">
              Loading order history...
            </TableCell>
          </TableRow>
        ) : orderHistories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-white-64">
              No order history available
            </TableCell>
          </TableRow>
        ) : (
          paged.map((orderHistory, key) => (
          <TableRow key={key}>
            <TableCell id="time-cell" className="whitespace-nowrap">
              {format(orderHistory.time, "d/M/yyyy HH:mm:ss a")}
            </TableCell>
            <TableCell id="asset-cell">
              <Token
                className="text-sm"
                pairs={[orderHistory.asset]}
                size="!size-4"
              />
            </TableCell>
            <TableCell
              id="direction-cell"
              className={cn(
                "uppercase",
                orderHistory.direction === "long"
                  ? "text-primary"
                  : "text-danger"
              )}
            >
              {orderHistory.direction}
            </TableCell>
            <TableCell id="price-cell">
              {formatPrice(orderHistory.price, {
                style: "currency",
                currencyDisplay: "symbol",
              })}
            </TableCell>
            <TableCell id="size-cell">
              {formatPrice(orderHistory.size)}
            </TableCell>
            <TableCell id="trade-value-cell">
              {formatPrice(orderHistory.trade_value)}
            </TableCell>
            <TableCell id="fee-cell">
              {formatPrice(orderHistory.fee, {
                style: "currency",
                currencyDisplay: "symbol",
              })}
            </TableCell>
            <TableCell
              id="closed-pnl-cell"
              className={cn(
                orderHistory.closed_pnl > 0
                  ? "text-primary"
                  : orderHistory.closed_pnl < 0
                  ? "text-danger"
                  : "text-white-48"
              )}
            >
              {formatPrice(orderHistory.closed_pnl)}
            </TableCell>
          </TableRow>
          ))
        )}
      </TableBody>
      </Table>
      {total > pageSize && (
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      )}
    </div>
  );
};
