import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AUTH_ERRORS, supabaseClient, supabaseConfigured } from "@/lib/supabase";

const providers: NextAuthOptions["providers"] = [
    // Email and password: the browser checks the password with Supabase (so Supabase's rate
    // limits apply to each visitor's own IP) and hands over the access token. Here we only
    // verify that token with Supabase; NextAuth keeps the session, the same one Google uses.
    CredentialsProvider({
        id: "credentials",
        name: "Email",
        credentials: {
            accessToken: { label: "Access token", type: "text" },
        },
        async authorize(credentials) {
            const accessToken = credentials?.accessToken;
            if (!accessToken) throw new Error(AUTH_ERRORS.invalid);
            if (!supabaseConfigured()) throw new Error(AUTH_ERRORS.unavailable);

            const { data, error } = await supabaseClient().auth.getUser(accessToken);
            if (error || !data.user) throw new Error(AUTH_ERRORS.invalid);
            if (!data.user.email_confirmed_at) throw new Error(AUTH_ERRORS.unconfirmed);
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
    // A week, so a stolen session does not outlive a password reset by a month.
    session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
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
