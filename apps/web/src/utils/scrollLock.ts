/**
 * Shared modal/dialog body-scroll lock manager.
 * Supports multiple simultaneous modals/drawers without premature unlocking.
 */
let lockCount = 0;
let previousOverflow = "";

export function lockBodyScroll(): void {
  if (typeof document === "undefined") return;
  lockCount++;
  if (lockCount === 1) {
    previousOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
  }
}

export function unlockBodyScroll(): void {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    previousOverflow = "";
  }
}

export function getBodyScrollLockCount(): number {
  return lockCount;
}

/** Reset for test teardown */
export function resetBodyScrollLock(): void {
  lockCount = 0;
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
    previousOverflow = "";
  }
}
