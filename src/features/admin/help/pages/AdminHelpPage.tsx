import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    Stack,
    TablePagination,
    TextField,
    Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

import { HELP_TOPICS, type HelpTopic } from "../data/helpTopics";
import { SUPPORT } from "../data/supportInfo";

const PAGE_SIZE = 10;
const BORDER = "1px solid #E2E8F0";

const isYoutube = (url?: string) =>
    Boolean(url && /^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(url.trim()));

function scrollTop() {
    window.scrollTo({ top: 0 });
    document.querySelector("main")?.scrollTo({ top: 0 });
}

function matches(topic: HelpTopic, words: string[]) {
    const haystack = [
        topic.title,
        topic.category,
        topic.summary,
        ...(topic.steps ?? []),
    ]
        .join(" ")
        .toLowerCase();

    return words.every((w) => haystack.includes(w));
}

function TopicCard({ topic }: { topic: HelpTopic }) {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const hasVideo = isYoutube(topic.videoUrl);

    const openVideo = () => {
        const win = window.open(topic.videoUrl!.trim(), "_blank", "noopener,noreferrer");
        if (!win) showSnackbar("Allow pop-ups to open the video.", "warning");
    };

    return (
        <Box sx={{ border: BORDER, borderRadius: 1.5, p: 2.5, bgcolor: "#fff" }}>
            <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
            >
                <Typography component="h2" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                    {topic.title}
                </Typography>
                <Chip label={topic.category} size="small" variant="outlined" />
            </Stack>

            <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                {topic.summary}
            </Typography>

            {topic.steps && topic.steps.length > 0 && (
                <Box component="ol" sx={{ pl: 3, my: 1.5, lineHeight: 1.8 }}>
                    {topic.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                </Box>
            )}

            <Stack direction="row" useFlexGap sx={{ mt: 2, gap: 1, flexWrap: "wrap" }}>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<PlayCircleOutlinedIcon />}
                    disabled={!hasVideo}
                    onClick={openVideo}
                >
                    {hasVideo ? "Watch video" : "Video coming soon"}
                </Button>

                {topic.adminPath && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={() => navigate(topic.adminPath!)}
                        sx={{ borderColor: "#CBD5E1" }}
                    >
                        Open this page
                    </Button>
                )}
            </Stack>
        </Box>
    );
}

export default function AdminHelpPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const results = useMemo(
        () => HELP_TOPICS.filter((t) => matches(t, words)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search],
    );

    const lastPage = Math.max(0, Math.ceil(results.length / PAGE_SIZE) - 1);
    const safePage = Math.min(page, lastPage);
    const visible = results.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

    const hasSupport = Boolean(
        SUPPORT.name || SUPPORT.phone || SUPPORT.whatsapp || SUPPORT.email,
    );

    const waDigits = SUPPORT.whatsapp.replace(/\D/g, "");
    const whatsappHref =
        waDigits.length >= 10
            ? `https://wa.me/${waDigits.length === 10 ? `91${waDigits}` : waDigits}`
            : null;

    const goToSupport = () =>
        document.getElementById("support")?.scrollIntoView({ block: "start" });

    return (
        <PageContainer>
            <PageHeader
                title="Help & Support"
                subtitle="Find a topic, watch the video, and learn how to use each part of the store."
                action={
                    <Button variant="outlined" color="inherit" onClick={goToSupport}>
                        Contact support
                    </Button>
                }
            />

            <Stack spacing={3}>
                <TextField
                    fullWidth
                    placeholder="Search topics, e.g. refund, stock, banner…"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                    }}
                    slotProps={{
                        htmlInput: { "aria-label": "Search help topics" },
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: search ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        aria-label="Clear search"
                                        onClick={() => {
                                            setSearch("");
                                            setPage(0);
                                        }}
                                    >
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : undefined,
                        },
                    }}
                />

                <Typography variant="body2" color="text.secondary">
                    {results.length === HELP_TOPICS.length
                        ? `${results.length} topics`
                        : `${results.length} of ${HELP_TOPICS.length} topics match`}
                </Typography>

                {visible.length === 0 ? (
                    <Box sx={{ border: BORDER, borderRadius: 1.5, p: 4, textAlign: "center", bgcolor: "#fff" }}>
                        <Typography sx={{ fontWeight: 700 }}>No topics found</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Try a different word, or contact support below.
                        </Typography>
                        {search && (
                            <Button sx={{ mt: 2 }} onClick={() => setSearch("")}>
                                Clear search
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {visible.map((topic) => (
                            <TopicCard key={topic.id} topic={topic} />
                        ))}
                    </Stack>
                )}

                {results.length > PAGE_SIZE && (
                    <TablePagination
                        component="div"
                        count={results.length}
                        page={safePage}
                        rowsPerPage={PAGE_SIZE}
                        rowsPerPageOptions={[]}
                        onPageChange={(_, next) => {
                            setPage(next);
                            scrollTop();
                        }}
                    />
                )}

                <Box id="support" sx={{ scrollMarginTop: 80 }}>
                    <SectionCard
                        title="Support"
                        subtitle="Stuck, or something not working? Contact the developer."
                    >
                        {hasSupport ? (
                            <Stack spacing={2}>
                                {SUPPORT.name && (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Developer
                                        </Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{SUPPORT.name}</Typography>
                                    </Box>
                                )}

                                <Stack direction="row" useFlexGap sx={{ gap: 1, flexWrap: "wrap" }}>
                                    {SUPPORT.phone && (
                                        <Button
                                            component="a"
                                            href={`tel:${SUPPORT.phone.replace(/[^\d+]/g, "")}`}
                                            variant="outlined"
                                            color="inherit"
                                            startIcon={<PhoneOutlinedIcon />}
                                            sx={{ borderColor: "#CBD5E1" }}
                                        >
                                            {SUPPORT.phone}
                                        </Button>
                                    )}
                                    {whatsappHref && (
                                        <Button
                                            component="a"
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variant="outlined"
                                            color="inherit"
                                            startIcon={<WhatsAppIcon />}
                                            sx={{ borderColor: "#CBD5E1" }}
                                        >
                                            {SUPPORT.whatsapp}
                                        </Button>
                                    )}
                                    {SUPPORT.email && (
                                        <Button
                                            component="a"
                                            href={`mailto:${SUPPORT.email}`}
                                            variant="outlined"
                                            color="inherit"
                                            startIcon={<EmailOutlinedIcon />}
                                            sx={{ borderColor: "#CBD5E1" }}
                                        >
                                            {SUPPORT.email}
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                        ) : (
                            <Typography color="text.secondary">
                                Support details are not added yet. Fill them in
                                <code> src/features/admin/help/data/supportInfo.ts</code>.
                            </Typography>
                        )}
                    </SectionCard>
                </Box>
            </Stack>
        </PageContainer>
    );
}