import type { KeyboardEvent } from "react";

/**
 * Stops a held-down key from clicking a button again and again. The lesson moves
 * focus to the next button after each step, so a held Enter would otherwise run
 * through several steps on its own.
 */
export function blockKeyRepeat(e: KeyboardEvent<HTMLElement>) {
    if (e.repeat) e.preventDefault();
}
