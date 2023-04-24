import { Skeleton, Stack } from "@mui/material";

export const MainSkeleton = () => {
  return (
    <Stack
      sx={{
        height: "100vh",
      }}
      justifyContent="space-between"
    >
      <Skeleton variant="rectangular" height={44} />
      <Stack spacing={1} sx={{ height: "100%", p: "0.5rem" }}>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} variant="rounded" height={60} />
        ))}
      </Stack>
      <Skeleton variant="rectangular" height={52} />
    </Stack>
  );
};
