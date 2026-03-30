import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Hourly check for expired scholarship feature status
crons.hourly(
  'expire-featured-scholarships',
  { minuteUTC: 0 },
  internal.scholarships.expireFeatured
);

export default crons;
