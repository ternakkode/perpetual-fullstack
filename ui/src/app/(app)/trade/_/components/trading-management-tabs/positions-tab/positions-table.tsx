"use client";

import { InfoCircle, LinkExternal02, XClose } from "@untitled-ui/icons-react";
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

import { AssetsTooltip } from "./assets-tooltip";
import { ClosePositionDialog } from "./close-position-dialog";
import { SharePositionDialog } from "./share-position-dialog";
import { formatPrice } from "../../../utils/price-utils";
import { usePositions } from "../../../hooks/use-positions";

export const PositionsTable = () => {
  const { columns, positions } = usePositions();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = positions.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return positions.slice(start, start + pageSize);
  }, [positions, page]);

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
            {positions.length > 0 && (
              <button className="text-primary hover:text-primary/60 transition-colors">
                Close All
              </button>
            )}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paged.map((position, key) => (
          <TableRow key={key}>
            <TableCell id="asset-cell">
              <Token
                pairs={[
                  ...position.assets.base.map((asset) => asset.token),
                  ...position.assets.quote.map((asset) => asset.token),
                ]}
              />
            </TableCell>
            <TableCell
              id="size-cell"
              className={position.size > 0 ? "text-primary" : "text-danger"}
            >
              {position.size > 0 ? "+" : "-"}
              {position.size}
            </TableCell>
            <TableCell id="value-cell">
              {formatPrice(position.value, {
                style: "currency",
                currencyDisplay: "symbol",
              })}
            </TableCell>
            <TableCell id="entry-price-cell">{position.entry_price}</TableCell>
            <TableCell id="market-price-cell">
              {position.market_price}
            </TableCell>
            <TableCell
              id="pnl-cell"
              className={
                position.pnl.percentage > 0 ? "text-primary" : "text-danger"
              }
            >
              <div className="flex items-center gap-1.5">
                {formatPrice(position.pnl.value)}({position.pnl.percentage.toFixed(3)}%)
                <SharePositionDialog
                  position={position}
                  trigger={<LinkExternal02 className="text-primary size-4" />}
                />
              </div>
            </TableCell>
            <TableCell id="liquid-price-cell">
              {position.liquid_price === 0 ? '-' : position.liquid_price.toFixed(2)}
            </TableCell>
            <TableCell id="margin-cell">
              {formatPrice(position.margin, {
                style: "currency",
                currencyDisplay: "symbol",
              })}
            </TableCell>
            <TableCell id="funding-cell">
              {position.funding || position.funding.toFixed(2)}
            </TableCell>
            <TableCell id="actions-cell" className="text-center">
              <ClosePositionDialog position={position}>
                <Button variant="ghost" size="icon">
                  <XClose className="text-white-48 size-4" />
                </Button>
              </ClosePositionDialog>
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
