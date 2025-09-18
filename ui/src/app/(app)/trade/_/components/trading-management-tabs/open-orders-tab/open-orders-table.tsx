"use client";

import { XClose } from "@untitled-ui/icons-react";
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
import { useOpenOrders } from "../../../hooks/use-open-orders";

export const OpenOrdersTable = () => {
  const { columns, openOrders, cancelOrder } = useOpenOrders();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = openOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return openOrders.slice(start, start + pageSize);
  }, [openOrders, page]);

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
            {openOrders.length > 0 && (
              <button className="text-primary hover:text-primary/60 transition-colors">
                Cancel All
              </button>
            )}
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
              {formatPrice(order.price)}
            </TableCell>
            <TableCell id="filled-cell">
              {order.filled.toFixed(6)}
            </TableCell>
            <TableCell id="remaining-cell">
              {order.remaining.toFixed(6)}
            </TableCell>
            <TableCell id="time-cell">
              {new Date(order.timestamp).toLocaleTimeString()}
            </TableCell>
            <TableCell id="actions-cell" className="text-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => cancelOrder(order.id)}
              >
                <XClose className="text-white-48 size-4" />
              </Button>
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
