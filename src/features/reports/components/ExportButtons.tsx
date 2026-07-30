import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
} from "@mui/material";

interface Props {
    onExportExcel: () => void;
    onExportPdf: () => void;
    onExportCsv?: () => void;
}

export default function ExportButtons({
    onExportExcel,
    onExportPdf,
    onExportCsv,
}: Props) {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <ButtonGroup
                    variant="contained"
                    fullWidth
                >
                    <Button onClick={onExportExcel}>
                        Export Excel
                    </Button>

                    <Button onClick={onExportPdf}>
                        Export PDF
                    </Button>

                    <Button
                        onClick={() =>
                            onExportCsv?.()
                        }
                        disabled={!onExportCsv}
                    >
                        Export CSV
                    </Button>
                </ButtonGroup>
            </CardContent>
        </Card>
    );
}