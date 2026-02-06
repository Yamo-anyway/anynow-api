/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;
import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
	BOWLING: D1Database;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/health') {
			return Response.json({
				ok: true,
				service: 'anynow-api',
				version: 'v1',
				ts: new Date().toISOString(),
			});
		}

		if (url.pathname === '/db-check') {
			const row = await env.BOWLING.prepare("SELECT 1 AS one, datetime('now') AS now").first();
			return Response.json({ ok: true, row });
		}

		return new Response('Not Found', { status: 404 });
	},
};
