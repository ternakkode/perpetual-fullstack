"use client";

import { XClose, Play, PauseCircle } from "@untitled-ui/icons-react";
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
import { useTwapOrders } from "../../../hooks/use-twap-orders";

export const TwapTable = () => {
  const { columns, twapOrders, cancelTwapOrder, pauseTwapOrder, resumeTwapOrder } = useTwapOrders();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = twapOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return twapOrders.slice(start, start + pageSize);
  }, [twapOrders, page]);

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
        {twapOrders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-white-48">
              No TWAP orders found
            </TableCell>
          </TableRow>
        ) : (
          paged.map((order, key) => (
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
            <TableCell id="size-cell">
              {order.totalSize.toFixed(6)}
            </TableCell>
            <TableCell id="duration-cell">
              {order.durationMinutes}m
            </TableCell>
            <TableCell id="progress-cell">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white-8 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${order.progressPercentage}%` }}
                  />
                </div>
                <span className="text-sm">{order.progressPercentage.toFixed(1)}%</span>
              </div>
            </TableCell>
            <TableCell id="filled-cell">
              {order.filledSize.toFixed(6)}
            </TableCell>
            <TableCell id="avg-price-cell">
              {order.avgPrice ? formatPrice(order.avgPrice) : "-"}
            </TableCell>
            <TableCell id="status-cell">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                order.status === "active" 
                  ? "bg-primary/20 text-primary"
                  : order.status === "paused"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-white-8 text-white-48"
              }`}>
                {order.status}
              </span>
            </TableCell>
            <TableCell id="actions-cell" className="text-center">
              <div className="flex items-center justify-center gap-1">
                {order.status === "active" ? (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => pauseTwapOrder(order.id)}
                  >
                    <PauseCircle className="text-yellow-500 size-4" />
                  </Button>
                ) : order.status === "paused" ? (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => resumeTwapOrder(order.id)}
                  >
                    <Play className="text-primary size-4" />
                  </Button>
                ) : null}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => cancelTwapOrder(order.id)}
                >
                  <XClose className="text-white-48 size-4" />
                </Button>
              </div>
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
