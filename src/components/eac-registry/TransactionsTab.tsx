import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import TransactionDetailsModal, {
  Transaction,
  DeliveryItem,
} from "./TransactionDetailsModal";
import CompanySelector, { Company } from "./CompanySelector";
import { useOrganization } from "@/context/OrganizationContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TransactionsTab = () => {
  const [highlightedTransactionId, setHighlightedTransactionId] = useState<
    string | null
  >(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, string>
  >({});

  const itemsPerPage = 10;

  const {
    wallets,
    organizations,
    transactionHistory,
    loadingTransactionHistory,
    fetchTransactionHistory,
  } = useOrganization();

  // Convert wallets to company format
  const companies: Company[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.address,
    logo: wallet.partnerProfile?.logo || null,
    division: wallet.profile.name || undefined,
    type: wallet.type,
    status: wallet.status,
    createdAt: wallet.createdAt,
  }));

  const [selectedWallet, setSelectedWallet] = useState<Company | null>(null);

  // Load initial wallet selection
  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      const lastWallet = wallets[wallets.length - 1];
      const company = {
        id: lastWallet.id,
        name: lastWallet.name,
        walletId: lastWallet.address,
        logo: lastWallet.partnerProfile?.logo || null,
        division: lastWallet.profile.name,
        type: lastWallet.type,
        status: lastWallet.status,
        createdAt: lastWallet.createdAt,
      };
      setSelectedWallet(company);
      fetchTransactionHistory(lastWallet.id, currentPage, itemsPerPage);
    }
  }, [wallets]);

  // Update first transaction status to "pending" after 10 seconds
  useEffect(() => {
    if (transactionHistory?.results && transactionHistory.results.length > 0) {
      const firstTransaction = transactionHistory.results[0];
      const transactionId = firstTransaction._id || firstTransaction.ownerId;

      const timeout = setTimeout(() => {
        setStatusOverrides((prev) => ({
          ...prev,
          [transactionId]: "pending",
        }));
        console.log(`Updated transaction ${transactionId} status to pending`);
      }, 10000); // 10 seconds

      return () => clearTimeout(timeout);
    }
  }, [transactionHistory?.results]);

  const handleCompanyChange = (companyId: string) => {
    const wallet = wallets.find((w) => w.id === companyId);
    if (wallet) {
      const company = {
        id: wallet.id,
        name: wallet.name,
        walletId: wallet.address,
        logo: wallet.partnerProfile?.logo || null,
        division: wallet.profile.name,
        type: wallet.type,
        status: wallet.status,
        createdAt: wallet.createdAt,
      };
      setSelectedWallet(company);
      setCurrentPage(1); // Reset to first page when changing wallet
      fetchTransactionHistory(wallet.id, 1, itemsPerPage);
    }
  };

  const handlePageChange = (page: number) => {
    if (selectedWallet) {
      setCurrentPage(page);
      fetchTransactionHistory(selectedWallet.id, page, itemsPerPage);
    }
  };

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const totalPages = transactionHistory
    ? Math.ceil(transactionHistory.total / itemsPerPage)
    : 0;

  if (!selectedWallet || loadingTransactionHistory) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
      </div>
    );
  }

  const handleExportTransactions = () => {
    if (
      !transactionHistory?.results ||
      transactionHistory.results.length === 0
    ) {
      console.log("No transactions to export");
      return;
    }

    // Define CSV headers
    const headers = [
      "Transaction ID",
      "Transaction Type",
      "Energy Type",
      "Quantity",
      "Unit Metric",
      "Status",
      "Initiated By",
      "Date",
      "Owner ID",
    ];

    // Convert transaction data to CSV rows
    const csvRows = transactionHistory.results.map((tx) => [
      tx._id || tx.ownerId,
      tx.ownerType,
      tx.energyType,
      tx.quantity.toString(),
      tx.unitMetric,
      tx.status,
      `${tx.firstName} ${tx.lastName}`,
      new Date(tx.createdAt).toLocaleString(),
      tx.ownerId,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${selectedWallet?.name || "export"}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log("transactionHistory", transactionHistory);

  return (
    <div className="pt-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Transaction History</CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <CompanySelector
            companies={companies}
            selectedCompany={selectedWallet}
            onSelectCompany={handleCompanyChange}
          />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {selectedWallet.logo && (
                <div className="mr-3">
                  <img
                    src={selectedWallet.logo}
                    alt={`${selectedWallet.name} Logo`}
                    className="h-10 w-10 object-contain rounded-sm border p-1"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium">{selectedWallet.name}</h3>
                <p className="text-muted-foreground">
                  Last updated: {selectedWallet.createdAt}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-8 bg-muted p-3 text-xs font-medium">
              <div className="col-span-2">Transaction ID</div>
              <div>Transaction Type</div>
              <div>Energy Type</div>
              <div>Quantity</div>
              <div>Status</div>
              <div>Initiated By</div>
              <div className="text-right">Date</div>
            </div>
            <div className="divide-y">
              {transactionHistory?.results.map((tx, key) => {
                const transactionId = tx._id || tx.ownerId;
                const displayStatus =
                  statusOverrides[transactionId] || tx.status;

                return (
                  <div
                    key={key}
                    id={`transaction-${tx._id}`}
                    className={cn(
                      "grid grid-cols-8 p-3 text-sm transition-colors duration-300",
                      highlightedTransactionId === tx._id && "bg-primary/10",
                      "hover:bg-muted cursor-pointer"
                    )}
                  >
                    <div className="font-mono text-xs col-span-2">
                      {tx._id ? tx._id : tx.ownerId}
                    </div>
                    <div>{tx.ownerType}</div>
                    <div>{tx.energyType}</div>
                    <div>
                      {tx.quantity} {tx.unitMetric}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          displayStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : displayStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </div>
                    <div>
                      {tx.firstName} {tx.lastName}
                    </div>
                    <div className="text-right text-xs">
                      {new Date(tx.createdAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTransactions}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Transactions
            </Button>
          </div>
        </CardContent>
      </Card>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TransactionsTab;
