// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// src/app.d.ts
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string;
				email: string;
				role: string;
			} | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};