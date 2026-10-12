import { describe, expect, it } from "vitest";
import { readLinkTokens } from "@/lib/supabase";

describe("readLinkTokens", () => {
    it("reads the tokens Supabase puts after # in a recovery link", () => {
        expect(readLinkTokens("#access_token=a&refresh_token=r&type=recovery")).toEqual({
            accessToken: "a", refreshToken: "r", type: "recovery", error: null,
        });
    });

    it("reports an expired or used link", () => {
        expect(readLinkTokens("#error=access_denied&error_code=otp_expired").error).toBe("otp_expired");
    });

    it("returns nothing for an empty hash", () => {
        expect(readLinkTokens("")).toEqual({ accessToken: null, refreshToken: null, type: null, error: null });
    });
});
