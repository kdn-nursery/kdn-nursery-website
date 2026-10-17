import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/server/admin/password";
import {
  LOGIN_FAILURE,
  adminPaymentChangeAllowed,
  canChangeFulfilment,
  detectImageType,
  isLoginLimited,
  isStaleEdit,
  passwordProblems,
  plainText,
  productDeleteDecision,
  reconcileStock,
  rupeesToPaise,
  safeInternalOrHttpsUrl,
  validateBulkTiers,
  validateComparePrice,
  publishedCatalogueFilter,
} from "@/server/admin/rules";

describe("admin access rules", () => {
  it("uses one generic failure message and limits repeated attempts", () => {
    expect(LOGIN_FAILURE).toBe("Invalid username or password.");
    expect(isLoginLimited(7, 1_000, 900)).toBe(false);
    expect(isLoginLimited(8, 1_000, 900)).toBe(true);
  });

  it("stores a hash rather than the password", async () => {
    const stored = await hashPassword("a-long-secret-1");
    expect(stored).not.toContain("a-long-secret-1");
    expect(await verifyPassword("a-long-secret-1", stored)).toBe(true);
    expect(await verifyPassword("wrong-password-1", stored)).toBe(false);
  });

  it("rejects a short password and a copy of the username", () => {
    expect(passwordProblems("short", "owner").length).toBeGreaterThan(0);
    expect(passwordProblems("nursery-owner", "nursery-owner")).toContain(
      "Do not use the username as the password.",
    );
  });
});

describe("catalogue validation", () => {
  it("stores rupees as paise and rejects invalid prices", () => {
    expect(rupeesToPaise("149.50")).toBe(14950);
    expect(rupeesToPaise("-1")).toBeNull();
    expect(rupeesToPaise("1.234")).toBeNull();
    expect(validateComparePrice(10000, 12000)).toBeNull();
    expect(validateComparePrice(10000, 10000)).toMatch(/higher/);
  });

  it("rejects negative stock and empty available stock", () => {
    expect(reconcileStock(-1, "available").ok).toBe(false);
    expect(reconcileStock(0, "available").ok).toBe(false);
    expect(reconcileStock(2, "out_of_stock")).toEqual({
      ok: true,
      stockQuantity: 0,
      availability: "out_of_stock",
    });
  });

  it("checks bulk tiers and stale versions", () => {
    expect(validateBulkTiers(10000, [{ minQuantity: 5, pricePaise: 9000 }])).toBeNull();
    expect(validateBulkTiers(10000, [{ minQuantity: 5, pricePaise: 10000 }])).toMatch(/lower/);
    expect(isStaleEdit(1, 2)).toBe(true);
    expect(productDeleteDecision(1)).toBe("archive");
    expect(productDeleteDecision(0)).toBe("delete");
  });
});

describe("order and upload safeguards", () => {
  it("blocks marking an order paid or refunded from the admin panel", () => {
    expect(adminPaymentChangeAllowed("PAID")).toBe(false);
    expect(adminPaymentChangeAllowed("REFUNDED")).toBe(false);
    expect(canChangeFulfilment("PENDING", "CONFIRMED")).toBe(true);
    expect(canChangeFulfilment("DELIVERED", "CANCELLED")).toBe(false);
  });

  it("keeps drafts and archived categories out of the public catalogue filter", () => {
    expect(publishedCatalogueFilter()).toEqual({
      status: "PUBLISHED",
      category: { isPublished: true, archivedAt: null },
    });
  });

  it("accepts only real image signatures and safe links", () => {
    expect(detectImageType(Uint8Array.from([0xff, 0xd8, 0xff, 0x00]))).toBe("jpeg");
    expect(detectImageType(Uint8Array.from([0x4d, 0x5a]))).toBeNull();
    expect(safeInternalOrHttpsUrl("/shop")).toBe(true);
    expect(safeInternalOrHttpsUrl("javascript:alert(1)")).toBe(false);
    expect(plainText("<script>alert(1)</script>")).not.toContain("<");
  });
});
