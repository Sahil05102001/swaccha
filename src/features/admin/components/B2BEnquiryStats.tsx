
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useB2BEnquiryCounts } from "../hooks/useB2BEnquiryCounts";

export default function B2BEnquiryStats() {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useB2BEnquiryCounts();

    return (
        <Box>
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    B2B Enquiries
                </Typography>

                <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => void refetch()}
                    disabled={isFetching}
                >
                    Refresh
                </Button>
            </Box>

            {isError && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => void refetch()}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error instanceof Error
                        ? error.message
                        : "Unable to load B2B enquiry counts."}
                </Alert>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                }}
            >
                <Card variant="outlined" sx={{ flex: 1 }}>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <InboxOutlinedIcon color="primary" fontSize="large" />

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Total Enquiries
                                </Typography>

                                {isLoading && !data ? (
                                    <CircularProgress size={22} />
                                ) : (
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {data?.totalEnquiries ?? "—"}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ flex: 1 }}>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <TodayOutlinedIcon color="primary" fontSize="large" />

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Received Today
                                </Typography>

                                {isLoading && !data ? (
                                    <CircularProgress size={22} />
                                ) : (
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {data?.enquiriesToday ?? "—"}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
