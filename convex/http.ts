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

    if (!callbackToken) {
      return new Response('Missing x-callback-token header', { status: 400 });
    }

    try {
      const result = await ctx.runAction(api.xenditActions.handleWebhook, {
        payload,
        callbackToken,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Xendit webhook error:', error);
      return new Response(
        JSON.stringify({ error: 'Webhook processing failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }),
});

export default http;
