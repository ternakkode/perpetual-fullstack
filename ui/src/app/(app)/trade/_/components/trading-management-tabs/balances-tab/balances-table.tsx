"use client";

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@brother-terminal/components/ui/table";
import { Button } from "@brother-terminal/components/ui/button";
import TokenIcon from "@brother-terminal/components/ui/token-icon";
import { ArrowUpRight, ArrowDownLeft, LinkExternal02 } from "@untitled-ui/icons-react";

import { formatPrice } from "../../../utils/price-utils";
import { useBalances } from "../../../hooks/use-balances";
import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "@/components/pagination-controls";

const columns = [
  { label: "Coin" },
  { label: "Total Balance" },
  { label: "Available Balance" },
  { label: "Send" },
  { label: "Transfer" },
  { label: "Contract" },
];

export const BalancesTable = () => {
  const { balances } = useBalances();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = balances.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return balances.slice(start, start + pageSize);
  }, [balances, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const handleSend = (token: string) => {
    console.log(`Send ${token}`);
    // TODO: Implement send functionality
  };

  const handleTransferToPerps = (token: string) => {
    console.log(`Transfer ${token} to Perps`);
    // TODO: Implement transfer to Perps functionality
  };

  const handleTransferToSpot = (token: string) => {
    console.log(`Transfer ${token} to Spot`);
    // TODO: Implement transfer to Spot functionality
  };

  const handleTransferToEVM = (token: string) => {
    console.log(`Transfer ${token} to EVM`);
    // TODO: Implement transfer to EVM functionality
  };

  const handleTransferFromEVM = (token: string) => {
    console.log(`Transfer ${token} from EVM`);
    // TODO: Implement transfer from EVM functionality
  };

  const handleViewContract = (token: string) => {
    console.log(`View ${token} contract`);
    // TODO: Implement contract viewing functionality
  };


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
        {paged.map((balance, key) => (
          <TableRow key={key}>
            <TableCell>
              <div className="flex items-center gap-2">
                <TokenIcon symbol={balance.token} size="20" />
                <div className="flex flex-col">
                  <span className="font-medium">{balance.symbol}</span>
                  <span className="text-xs text-white-64">{balance.token}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{balance.total.toFixed(6)}</span>
                <span className="text-xs text-white-64">
                  {formatPrice(balance.usdValue, {
                    style: "currency",
                    currencyDisplay: "symbol",
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium">{balance.available.toFixed(6)}</span>
            </TableCell>
            <TableCell>
              <Button
                className="h-7 px-2 text-xs font-medium py-1"
                onClick={() => handleSend(balance.token)}
              >
                Send
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                {balance.token === "USDC" ? (
                  // For USDC: Show Spot/Perps transfer button (single button with text)
                  <Button
                    className="h-7 px-2 text-xs font-medium py-1"
                    onClick={() => balance.symbol.includes("(Perps)") 
                      ? handleTransferToSpot(balance.token)
                      : handleTransferToPerps(balance.token)
                    }
                  >
                    {balance.symbol.includes("(Perps)") 
                      ? "To Spot" 
                      : "To Perps"
                    }
                  </Button>
                ) : (
                  // For other tokens: Show EVM transfer buttons with text
                  <>
                    <Button
                      className="h-7 px-2 text-xs font-medium py-1"
                      onClick={() => handleTransferToEVM(balance.token)}
                    >
                      To EVM
                    </Button>
                    <Button
                      className="h-7 px-2 text-xs font-medium py-1"
                      onClick={() => handleTransferFromEVM(balance.token)}
                    >
                      From EVM
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              {balance.token !== "USDC" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleViewContract(balance.token)}
                  title="View Contract"
                >
                  <LinkExternal02 className="h-3 w-3" />
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
