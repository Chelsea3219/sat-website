// Slide in from the direction of travel, slide out the opposite way
export const slide = {
    enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: -dir * 80, opacity: 0 }),
}