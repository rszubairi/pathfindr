import { cronJobs } from 'convex/server';
import { internal, api } from './_generated/api';

const crons = cronJobs();

// Hourly check for expired scholarship feature status
crons.hourly(
  'expire-featured-scholarships',
  { minuteUTC: 0 },
  internal.scholarships.expireFeatured
);

// Daily check to close scholarships whose deadline has passed
crons.daily(
  'close-expired-scholarships',
  { hourUTC: 0, minuteUTC: 0 },
  api.scholarships.closeExpiredScholarships
);

export default crons;
