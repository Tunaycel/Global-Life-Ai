import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AUTH_ERRORS, supabaseConfigured, supabaseServer } from "@/lib/supabase";

const providers: NextAuthOptions["providers"] = [
    // Email and password: Supabase Auth checks the password; NextAuth keeps the session,
    // so both sign-in methods end in the same session.
    CredentialsProvider({
        id: "credentials",
        name: "Email",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            const email = credentials?.email?.trim().toLowerCase();
            const password = credentials?.password;
            if (!email || !password) throw new Error(AUTH_ERRORS.invalid);
            if (!supabaseConfigured()) throw new Error(AUTH_ERRORS.unavailable);

            const { data, error } = await supabaseServer().auth.signInWithPassword({ email, password });
            if (error) {
                if (error.code === "email_not_confirmed") throw new Error(AUTH_ERRORS.unconfirmed);
                if (error.code === "invalid_credentials" || error.status === 400) throw new Error(AUTH_ERRORS.invalid);
                throw new Error(AUTH_ERRORS.unavailable);
            }
            const user = data.user;
            return {
                id: user.id,
                email: user.email,
                name: (user.user_metadata?.full_name as string | undefined) ?? user.email?.split("@")[0] ?? null,
            };
        },
    }),
];

// Google only when its keys are set, so a missing key never breaks email sign-in.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    );
}

const handler = NextAuth({
    providers,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                (session.user as Record<string, unknown>).id = token.sub;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // After sign in, redirect to dashboard
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return `${baseUrl}/dashboard`;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
