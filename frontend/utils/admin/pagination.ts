// utils/pagination.ts
// Returns 0-based page indexes for a window of `size` pages.
// The window starts sliding once `current` passes position `anchor` (1-based) within it.
export function getPageWindow(current: number, total: number, size = 20, anchor = 15): number[] {
    if (total <= size) {
        return Array.from({ length: total }, (_, i) => i)   // all pages fit
    }

    const maxStart = total - size                           // window can't slide past the end
    const start = Math.min(Math.max(0, current - (anchor - 1)), maxStart)

    return Array.from({ length: size }, (_, i) => start + i)
}