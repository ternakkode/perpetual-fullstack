"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@brother-terminal/components/ui/table";
import { useHyperliquidSDKStore } from "@/store/useHyperliquidSDKStore";
import { formatTimestamp, formatPriceToOptimalDecimals } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "@/components/pagination-controls";
import TokenIcon from "@brother-terminal/components/ui/token-icon";

const columns = [
  { label: "Time" },
  { label: "Asset/Size" },
  { label: "Funding Rate" },
  { label: "Funding Amount" },
];

export const FundingHistoryTable = () => {
  const { userFundings, isLoadingUserFundings } = useHyperliquidSDKStore();
  
  // Extract fundings array from WsUserFundings data
  const fundingsArray = userFundings?.fundings || [];

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = fundingsArray.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return fundingsArray.slice(start, start + pageSize);
  }, [fundingsArray, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  if (isLoadingUserFundings) {
    return (
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
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-white-64">
              Loading funding history...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

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
        {fundingsArray.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-white-64">
              No funding history available
            </TableCell>
          </TableRow>
        ) : (
          paged.map((funding, index) => (
            <TableRow key={`${funding.coin}-${funding.time}-${index}`}>
              <TableCell className="text-white-80">
                {formatTimestamp(funding.time)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TokenIcon symbol={funding.coin} size="20" />
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{funding.coin}</span>
                    <span className="text-white-64 text-sm">
                      {formatPriceToOptimalDecimals(Math.abs(parseFloat(funding.szi)))}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-white-80">
                {(parseFloat(funding.fundingRate) * 100).toFixed(6)}%
              </TableCell>
              <TableCell className={parseFloat(funding.usdc) >= 0 ? "text-success" : "text-danger"}>
                {parseFloat(funding.usdc) >= 0 ? "+" : ""}${formatPriceToOptimalDecimals(Math.abs(parseFloat(funding.usdc)))}
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
