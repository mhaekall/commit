import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://b39ec75df26d1a51f7544971cd455208@o4510997666660352.ingest.us.sentry.io/4510997673410560",
  tracesSampleRate: 1,
  debug: false,
});
