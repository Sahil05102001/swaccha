import {
    Card,
    CardContent,
    Skeleton,
    Stack,
} from "@mui/material";

export default function AddressCardSkeleton() {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Skeleton
                        variant="text"
                        width="30%"
                        height={32}
                    />

                    <Skeleton
                        variant="text"
                        width="70%"
                    />

                    <Skeleton
                        variant="text"
                        width="90%"
                    />

                    <Skeleton
                        variant="text"
                        width="60%"
                    />

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Skeleton
                            variant="rounded"
                            width={90}
                            height={36}
                        />

                        <Skeleton
                            variant="rounded"
                            width={90}
                            height={36}
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}