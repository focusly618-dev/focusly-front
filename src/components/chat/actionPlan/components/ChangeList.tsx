import { Box, Typography } from '@mui/material';
import { After, Before, ChangeRow } from '../ActionPlan.styles';

export interface Change {
  label: string;
  before: string | null;
  after: string;
}

/** Field-by-field "before → after" for a change to something that exists. */
export const ChangeList = ({ changes }: { changes: Change[] }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
    {changes.map((change) => (
      <ChangeRow key={change.label}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 650 }}
        >
          {change.label}
        </Typography>
        <Box>
          {change.before && (
            <>
              <Before>{change.before}</Before>
              {' → '}
            </>
          )}
          <After>{change.after}</After>
        </Box>
      </ChangeRow>
    ))}
  </Box>
);
