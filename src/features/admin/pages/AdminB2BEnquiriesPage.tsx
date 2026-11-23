import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Link,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import { B2B_ENQUIRY_COUNTS_QUERY_KEY } from "../hooks/useB2BEnquiryCounts";
import { getB2BEnquiries } from "../services/b2bEnquiriesListService";

const ENQUIRIES_QUERY_KEY = ["admin-b2b-enquiries"] as const;
const MESSAGE_PREVIEW_LENGTH = 120;

const COLUMNS = [
  "Business",
  "Contact person",
  "Phone",
  "Email",
  "Products",
  "Message",
  "Quantity",
  "Received",
];

interface PageNavigation {
  cursor?: string;
  direction: "next" | "previous";
}

function MessageCell({ message }: { message?: string }) {
  const [expanded, setExpanded] = useState(false);
  const text = message?.trim();

  if (!text) return <>—</>;

  const isLong = text.length > MESSAGE_PREVIEW_LENGTH;

  return (
    <>
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
      >
        {isLong && !expanded
          ? `${text.slice(0, MESSAGE_PREVIEW_LENGTH).trimEnd()}…`
          : text}
      </Typography>

      {isLong && (
        <Button
          size="small"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          sx={{ p: 0, minWidth: 0, mt: 0.5 }}
        >
          {expanded ? "Show less" : "Read more"}
        </Button>
      )}
    </>
  );
}

export default function AdminB2BEnquiriesPage() {
  const [navigation, setNavigation] = useState<PageNavigation>({
    direction: "next",
  });
  const [pageNumber, setPageNumber] = useState(1);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
    dataUpdatedAt,
  } = useQuery({
    queryKey: [
      ...ENQUIRIES_QUERY_KEY,
      navigation.cursor ?? null,
      navigation.direction,
    ],
    queryFn: () => getB2BEnquiries(navigation.cursor, navigation.direction),
    // Keeps the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const enquiries = data?.enquiries ?? [];

  const goToNextPage = () => {
    if (!data?.nextCursor || isFetching) return;

    setNavigation({ cursor: data.nextCursor, direction: "next" });
    setPageNumber((page) => page + 1);
    scrollToTop();
  };

  const goToPreviousPage = () => {
    if (!data?.previousCursor || isFetching) return;

    setNavigation({ cursor: data.previousCursor, direction: "previous" });
    setPageNumber((page) => Math.max(1, page - 1));
    scrollToTop();
  };

  // Back to the first page, so new enquiries appear at the top.
  const refreshPage = () => {
    setNavigation({ direction: "next" });
    setPageNumber(1);
    void queryClient.resetQueries({ queryKey: ENQUIRIES_QUERY_KEY });
    void queryClient.invalidateQueries({
      queryKey: B2B_ENQUIRY_COUNTS_QUERY_KEY,
    });
  };

  const updatedAt =
    dataUpdatedAt && !isPlaceholderData
      ? new Date(dataUpdatedAt).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <PageContainer>
      <PageHeader
        title="B2B Enquiries"
        subtitle="Bulk purchase enquiries from business customers, newest first."
        action={
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            {updatedAt && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Updated {updatedAt}
              </Typography>
            )}

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={refreshPage}
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </Stack>
        }
      />

      <SectionCard>
        {isError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => void refetch()}>
                Retry
              </Button>
            }
          >
            {error instanceof Error
              ? error.message
              : "Failed to load B2B enquiries."}
          </Alert>
        )}

        <TableContainer
          sx={{ overflowX: "auto", opacity: isPlaceholderData ? 0.6 : 1 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                [0, 1, 2, 3, 4].map((row) => (
                  <TableRow key={row}>
                    {COLUMNS.map((column) => (
                      <TableCell key={column}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                enquiries.map((enquiry) => {
                  const raw = enquiry.createdAt;
                  const seconds = raw?._seconds ?? raw?.seconds;

                  const receivedAt =
                    typeof seconds === "number"
                      ? new Date(seconds * 1000).toLocaleString("en-IN")
                      : "—";

                  return (
                    <TableRow key={enquiry.id}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {enquiry.businessName}
                      </TableCell>

                      <TableCell>{enquiry.name}</TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Link href={`tel:${enquiry.phone}`} underline="hover">
                          {enquiry.phone}
                        </Link>
                      </TableCell>

                      <TableCell sx={{ wordBreak: "break-all" }}>
                        {enquiry.email ? (
                          <Link href={`mailto:${enquiry.email}`} underline="hover">
                            {enquiry.email}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 160 }}>
                        {enquiry.products}
                      </TableCell>

                      <TableCell sx={{ minWidth: 200, maxWidth: 300 }}>
                        <MessageCell message={enquiry.message} />
                      </TableCell>

                      <TableCell>{enquiry.quantity}</TableCell>

                      <TableCell sx={{ minWidth: 150 }}>{receivedAt}</TableCell>
                    </TableRow>
                  );
                })
              )}

              {!isLoading && enquiries.length === 0 && !isError && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No B2B enquiries received yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {(data?.nextCursor || data?.previousCursor) && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={goToPreviousPage}
              disabled={!data?.previousCursor || isFetching}
            >
              Previous
            </Button>

            <Typography variant="caption" color="text.secondary">
              Page {pageNumber}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              onClick={goToNextPage}
              disabled={!data?.nextCursor || isFetching}
            >
              Next
            </Button>
          </Box>
        )}
      </SectionCard>
    </PageContainer>
  );
}