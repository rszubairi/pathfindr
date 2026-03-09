import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/stripe-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 });
    }

    try {
      const result = await ctx.runAction(api.stripeActions.handleWebhook, {
        payload,
        signature,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response(
        JSON.stringify({ error: 'Webhook processing failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }),
});

export default http;
