import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/xendit-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const payload = await request.text();
    const callbackToken = request.headers.get('x-callback-token');
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    // If token env var is set, enforce verification. If not yet configured, log and pass through.
    if (expectedToken && callbackToken !== expectedToken) {
      console.error('Xendit webhook: invalid callback token');
      // Return 200 so Xendit does not keep retrying with bad credentials
      return new Response(JSON.stringify({ error: 'Invalid callback token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const result = await ctx.runAction(api.xenditActions.handleWebhook, {
        payload,
        callbackToken: callbackToken ?? '',
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // Log but return 200 — Xendit retries on non-2xx which could flood the endpoint
      console.error('Xendit webhook processing error:', error);
      return new Response(
        JSON.stringify({ error: 'Webhook processing failed' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }),
});

export default http;
