import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface ProfileInfoCardProps {
  user: any;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  onSaveProfile: () => void;
  onVerifyEmail: () => void;
  onRefreshStatus: () => void;
}

export default function ProfileInfoCard({
  user,
  name,
  setName,
  onSaveProfile,
  onVerifyEmail,
  onRefreshStatus,
}: ProfileInfoCardProps) {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center" }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                fontSize: 28,
              }}
            >
              {user.displayName?.charAt(0).toUpperCase() ?? "U"}
            </Avatar>

            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700 }}
              >
                My Profile
              </Typography>

              <Typography color="text.secondary">
                Welcome back!
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Full Name
            </Typography>

            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={onSaveProfile}
            >
              Save Changes
            </Button>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Email
            </Typography>

            <Typography variant="h6">
              {user.email}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Email Verification
            </Typography>

            <Chip
              label={
                user.emailVerified
                  ? "Verified"
                  : "Not Verified"
              }
              color={
                user.emailVerified
                  ? "success"
                  : "warning"
              }
            />

            {!user.emailVerified && (
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Button
                  variant="contained"
                  onClick={onVerifyEmail}
                >
                  Send Verification Email
                </Button>

                <Button
                  variant="outlined"
                  onClick={onRefreshStatus}
                >
                  Refresh Status
                </Button>
              </Stack>
            )}
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              User ID
            </Typography>

            <Typography
              variant="body2"
              sx={{
                wordBreak: "break-all",
              }}
            >
              {user.uid}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}