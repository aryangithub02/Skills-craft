import { handlers } from "@/auth"; // Referring to auth.js in root

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const { GET, POST } = handlers;
