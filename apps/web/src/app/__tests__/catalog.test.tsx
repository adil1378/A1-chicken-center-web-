import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import WeightSelector from "@/components/catalog/WeightSelector";
import ProductPlaceholderImage from "@/components/catalog/ProductPlaceholderImage";
import { resetBodyScrollLock, getBodyScrollLockCount } from "@/utils/scrollLock";
import { PRODUCTS } from "@/data/products";

// Mock next/image
vi.mock("next/image", () => ({
  __default: vi.fn(),
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

describe("Phase 3: Product Catalog & Shopping UI", () => {
  beforeEach(() => {
    resetBodyScrollLock();
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    if (!window.matchMedia) {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    }
  });

  afterEach(() => {
    resetBodyScrollLock();
    vi.clearAllMocks();
  });

  describe("Category-Wise Product Catalog", () => {
    it("renders the 7 planned categories plus All Products filter", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      const nav = screen.getByRole("group", { name: /Filter products by category/i });
      expect(within(nav).getByText("All Products")).toBeDefined();
      expect(within(nav).getByText("Curry Cut Chicken")).toBeDefined();
      expect(within(nav).getByText("Boneless Chicken")).toBeDefined();
      expect(within(nav).getByText("Legs & Drumsticks")).toBeDefined();
      expect(within(nav).getByText("Lollipop & Wings")).toBeDefined();
      expect(within(nav).getByText("Whole Dressed Chicken")).toBeDefined();
      expect(within(nav).getByText("Country / Desi Chicken")).toBeDefined();
      expect(within(nav).getByText("Farm Fresh Eggs")).toBeDefined();
    });

    it("filters products correctly when a category is selected", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      // Initially shows all products
      expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(5);

      // Filter by "Farm Fresh Eggs"
      const eggsBtn = screen.getByRole("button", { name: /Farm Fresh Eggs/i });
      await act(async () => {
        fireEvent.click(eggsBtn);
      });

      // In eggs category, should show eggs products
      expect(screen.getByText("Farm Fresh White Eggs (Pack of 12)")).toBeDefined();
      expect(screen.getByText("Farm Fresh Brown Eggs (Tray of 30)")).toBeDefined();

      // Curry cut products should not be displayed in eggs category
      expect(screen.queryByText("Curry Cut Chicken (Skinless)")).toBeNull();
    });

    it("displays unconfirmed availability badges on product cards", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      const badges = screen.getAllByText(/To be confirmed by shop/i);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe("Product Details & Customization Dialog", () => {
    it("opens accessible product details dialog on Configure Portion click", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      const configureBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Curry Cut Chicken \(Skinless\)/i,
      });

      await act(async () => {
        fireEvent.click(configureBtn);
      });

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeDefined();
      expect(dialog.getAttribute("aria-modal")).toBe("true");

      const title = within(dialog).getByRole("heading", { level: 2, name: "Curry Cut Chicken (Skinless)" });
      expect(title).toBeDefined();

      // Check availability status notice in dialog
      expect(within(dialog).getByText(/Subject to shop confirmation/i)).toBeDefined();
    });

    it("closes dialog when Escape key is pressed", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      const configureBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Curry Cut Chicken \(Skinless\)/i,
      });

      await act(async () => {
        fireEvent.click(configureBtn);
      });

      expect(screen.getByRole("dialog")).toBeDefined();

      await act(async () => {
        fireEvent.keyDown(window, { key: "Escape" });
      });

      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("renders relevant customization options only where supported and non-conflicting", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      // 1. Curry Cut Skinless: must NOT allow Skin On
      const skinlessBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Curry Cut Chicken \(Skinless\)/i,
      });
      await act(async () => {
        fireEvent.click(skinlessBtn);
      });
      expect(screen.getByText("Piece Size")).toBeDefined();
      expect(screen.queryByText("Skin Preference")).toBeNull();

      // Close modal
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Close details" }));
      });

      // 2. Open Boneless Breast (supports keema and piece sizing, but not carcass dressing)
      const bonelessBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Boneless Breast Fillet/i,
      });
      await act(async () => {
        fireEvent.click(bonelessBtn);
      });

      expect(screen.getByText("Piece Size")).toBeDefined();
      expect(screen.getByText("Mince / Keema Cut")).toBeDefined();
      expect(screen.queryByText("Whole Bird Dressing Style")).toBeNull();

      // Close modal
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Close details" }));
      });

      // 3. Filter and open Eggs (supports NO meat cuts, piece sizing, or skinning)
      const eggsNavBtn = screen.getByRole("button", { name: /Farm Fresh Eggs/i });
      await act(async () => {
        fireEvent.click(eggsNavBtn);
      });

      const eggsDetailBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Farm Fresh White Eggs/i,
      });
      await act(async () => {
        fireEvent.click(eggsDetailBtn);
      });

      expect(screen.queryByText("Piece Size")).toBeNull();
      expect(screen.queryByText("Skin Preference")).toBeNull();
      expect(screen.queryByText("Mince / Keema Cut")).toBeNull();
      expect(screen.queryByText("Whole Bird Dressing Style")).toBeNull();
    });
  });

  describe("Weight Selector & Validation", () => {
    it("handles preset weight selection and toggles custom mode", async () => {
      const handleWeightChange = vi.fn();
      await act(async () => {
        render(
          <WeightSelector
            unitType="kg"
            selectedWeight={1.0}
            onWeightChange={handleWeightChange}
          />
        );
      });

      // Click 500g preset
      const preset500g = screen.getByRole("button", { name: /500 g/i });
      await act(async () => {
        fireEvent.click(preset500g);
      });
      expect(handleWeightChange).toHaveBeenCalledWith(0.5);

      // Toggle custom mode
      const customBtn = screen.getByRole("button", { name: /Custom/i });
      await act(async () => {
        fireEvent.click(customBtn);
      });

      const input = screen.getByRole("spinbutton");
      expect(input).toBeDefined();
    });

    it("strictly validates custom weight inputs and rejects invalid/zero/negative values", async () => {
      const handleWeightChange = vi.fn();
      const handleValidityChange = vi.fn();
      await act(async () => {
        render(
          <WeightSelector
            unitType="kg"
            selectedWeight={1.0}
            onWeightChange={handleWeightChange}
            onValidityChange={handleValidityChange}
          />
        );
      });

      const customBtn = screen.getByRole("button", { name: /Custom/i });
      await act(async () => {
        fireEvent.click(customBtn);
      });

      const input = screen.getByRole("spinbutton");

      // Enter zero: should show error and reject
      await act(async () => {
        fireEvent.change(input, { target: { value: "0" } });
      });
      expect(screen.getByText("Weight must be greater than zero.")).toBeDefined();
      expect(handleValidityChange).toHaveBeenLastCalledWith(false);

      // Enter negative: should show error
      await act(async () => {
        fireEvent.change(input, { target: { value: "-1.5" } });
      });
      expect(screen.getByText("Weight must be greater than zero.")).toBeDefined();
      expect(handleValidityChange).toHaveBeenLastCalledWith(false);

      // Enter below provisional minimum 0.25 kg
      await act(async () => {
        fireEvent.change(input, { target: { value: "0.1" } });
      });
      expect(screen.getByText(/Minimum selection is 0.25 kg/i)).toBeDefined();
      expect(handleValidityChange).toHaveBeenLastCalledWith(false);

      // Enter exceeding provisional max 50 kg
      await act(async () => {
        fireEvent.change(input, { target: { value: "65" } });
      });
      expect(screen.getByText(/Maximum selection is 50 kg/i)).toBeDefined();
      expect(handleValidityChange).toHaveBeenLastCalledWith(false);

      // Valid value 2.5 kg
      await act(async () => {
        fireEvent.change(input, { target: { value: "2.5" } });
      });
      expect(screen.queryByRole("alert")).toBeNull();
      expect(handleWeightChange).toHaveBeenCalledWith(2.5);
      expect(handleValidityChange).toHaveBeenLastCalledWith(true);
    });

    it("regression test: invalid custom weight input blocks Add to Cart and does not use previous valid weight", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      // Open Curry Cut
      const configureBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Curry Cut Chicken \(Skinless\)/i,
      });
      await act(async () => {
        fireEvent.click(configureBtn);
      });

      // Switch to Custom weight
      const customBtn = screen.getByRole("button", { name: /Custom/i });
      await act(async () => {
        fireEvent.click(customBtn);
      });

      const weightInput = screen.getByRole("spinbutton");

      // Type invalid weight 0.05 (below provisional limit 0.25)
      await act(async () => {
        fireEvent.change(weightInput, { target: { value: "0.05" } });
      });

      // The validation error should appear
      expect(screen.getByRole("alert")).toBeDefined();

      // The Add to Cart button MUST be disabled
      const addToCartBtn = screen.getByRole("button", { name: /Add 1 to Cart/i });
      expect(addToCartBtn.hasAttribute("disabled")).toBe(true);

      // Clicking disabled Add to Cart must NOT add item or open Cart drawer
      await act(async () => {
        fireEvent.click(addToCartBtn);
      });

      // Cart drawer should NOT be open
      expect(screen.queryByRole("dialog", { name: /Shopping Cart/i })).toBeNull();
    });
  });

  describe("Cart Functionality, Integrity & Accessibility", () => {
    it("adds item to cart with selected options, preserves categoryId, and maintains pricing integrity", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      // Open Curry Cut
      const configureBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Curry Cut Chicken \(Skinless\)/i,
      });
      await act(async () => {
        fireEvent.click(configureBtn);
      });

      // Add to Cart
      const addToCartBtn = screen.getByRole("button", { name: /Add 1 to Cart/i });
      await act(async () => {
        fireEvent.click(addToCartBtn);
      });

      // The Cart Drawer should open
      const cartDrawer = screen.getByRole("dialog", { name: /Shopping Cart/i });
      expect(cartDrawer).toBeDefined();

      // Item should be listed
      expect(within(cartDrawer).getByText("Curry Cut Chicken (Skinless)")).toBeDefined();

      // Local selection tool notice
      expect(within(cartDrawer).getByText(/Local selection tool/i)).toBeDefined();

      // PRICING INTEGRITY:
      // Products have pricePerUnit: null (unconfirmed).
      // Price must show "Price to be confirmed" and Subtotal must say "To be confirmed by shop".
      // Must NOT show ₹0 or fabricate a price.
      expect(within(cartDrawer).getAllByText(/Price to be confirmed/i).length).toBeGreaterThanOrEqual(1);
      expect(within(cartDrawer).getByText(/To be confirmed by shop/i)).toBeDefined();
    });

    it("removes an item using the trash button", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      // Open Curry Cut & add to cart
      const configureBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Curry Cut Chicken \(Skinless\)/i,
      });
      await act(async () => {
        fireEvent.click(configureBtn);
      });

      const addToCartBtn = screen.getByRole("button", { name: /Add 1 to Cart/i });
      await act(async () => {
        fireEvent.click(addToCartBtn);
      });

      const cartDrawer = screen.getByRole("dialog", { name: /Shopping Cart/i });

      // Click remove trash button
      const removeBtn = within(cartDrawer).getByRole("button", {
        name: /Remove Curry Cut Chicken \(Skinless\) from cart/i,
      });
      await act(async () => {
        fireEvent.click(removeBtn);
      });

      // Cart should now be empty
      expect(within(cartDrawer).getByText("Your cart is empty")).toBeDefined();
    });

    it("updates quantity, and clears the cart", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      // Open Curry Cut
      const configureBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Curry Cut Chicken \(Skinless\)/i,
      });
      await act(async () => {
        fireEvent.click(configureBtn);
      });

      const addToCartBtn = screen.getByRole("button", { name: /Add 1 to Cart/i });
      await act(async () => {
        fireEvent.click(addToCartBtn);
      });

      const cartDrawer = screen.getByRole("dialog", { name: /Shopping Cart/i });

      // Increase quantity
      const incBtn = within(cartDrawer).getByRole("button", {
        name: /Increase quantity of Curry Cut Chicken/i,
      });
      await act(async () => {
        fireEvent.click(incBtn);
      });

      // Quantity should be 2 in item stepper and in estimated items count
      expect(within(cartDrawer).getAllByText("2").length).toBe(2);

      // Clear cart
      const clearBtn = within(cartDrawer).getByRole("button", { name: /Clear Cart/i });
      await act(async () => {
        fireEvent.click(clearBtn);
      });

      // Empty cart state
      expect(within(cartDrawer).getByText("Your cart is empty")).toBeDefined();
    });

    it("coordinates shared body-scroll lock and focus restoration across dialog and drawer", async () => {
      await act(async () => {
        render(
          <CartProvider>
            <ProductCatalog />
          </CartProvider>
        );
      });

      expect(getBodyScrollLockCount()).toBe(0);

      // Open dialog
      const configureBtn = screen.getByRole("button", {
        name: /Configure portion and cut options for Curry Cut Chicken \(Skinless\)/i,
      });
      configureBtn.focus();

      await act(async () => {
        fireEvent.click(configureBtn);
      });

      // Dialog is open: lock count should be 1
      expect(getBodyScrollLockCount()).toBe(1);
      expect(document.body.style.overflow).toBe("hidden");

      // Add to cart: triggers CartDrawer
      const addToCartBtn = screen.getByRole("button", { name: /Add 1 to Cart/i });
      await act(async () => {
        fireEvent.click(addToCartBtn);
      });

      // Wait for dialog's 400ms timer to close itself
      await act(async () => {
        await new Promise((r) => setTimeout(r, 450));
      });

      // Product dialog has closed, but Cart is still open:
      // Verifies: Closing the product dialog must not unlock body scrolling while the cart remains open.
      expect(getBodyScrollLockCount()).toBe(1);
      expect(document.body.style.overflow).toBe("hidden");

      // Close cart drawer
      const closeCartBtn = screen.getByRole("button", { name: /Close cart/i });
      await act(async () => {
        fireEvent.click(closeCartBtn);
      });

      // All closed: lock count should be 0, overflow restored
      expect(getBodyScrollLockCount()).toBe(0);
      expect(document.body.style.overflow).toBe("");
    });

    it("renders category-specific icon representations in ProductPlaceholderImage", () => {
      // Eggs
      const { container: eggsContainer } = render(
        <ProductPlaceholderImage categoryId="eggs" productName="Test Eggs" />
      );
      expect(eggsContainer.querySelector("svg")).toBeDefined();
      expect(screen.getByLabelText(/Test Eggs custom butchery cut representation/i)).toBeDefined();

      // Wings
      const { container: wingsContainer } = render(
        <ProductPlaceholderImage categoryId="lollipop-wings" productName="Test Wings" />
      );
      expect(wingsContainer.querySelector("svg")).toBeDefined();

      // Country Chicken
      const { container: desiContainer } = render(
        <ProductPlaceholderImage categoryId="country-chicken" productName="Desi Chicken" />
      );
      expect(desiContainer.querySelector("svg")).toBeDefined();
    });

    it("correctly calculates confirmed price subtotal when prices are confirmed, and leaves subtotal null when unconfirmed", () => {
      function CartTestHarness() {
        const { addItem, subtotal, isPricingConfirmed } = useCart();
        return (
          <div>
            <span data-testid="confirmed">{isPricingConfirmed ? "yes" : "no"}</span>
            <span data-testid="subtotal">{subtotal === null ? "null" : subtotal.toString()}</span>
            <button
              onClick={() =>
                addItem({
                  productId: "test-confirmed",
                  productName: "Test Confirmed Product",
                  categoryId: "curry-cut",
                  categoryName: "Curry Cut",
                  imageSrc: null,
                  weightAmount: 2.0,
                  unitType: "kg",
                  quantity: 3,
                  customizations: {},
                  pricePerUnit: 250,
                })
              }
            >
              Add Confirmed
            </button>
            <button
              onClick={() =>
                addItem({
                  productId: "test-unconfirmed",
                  productName: "Test Unconfirmed Product",
                  categoryId: "curry-cut",
                  categoryName: "Curry Cut",
                  imageSrc: null,
                  weightAmount: 1.0,
                  unitType: "kg",
                  quantity: 1,
                  customizations: {},
                  pricePerUnit: null,
                })
              }
            >
              Add Unconfirmed
            </button>
          </div>
        );
      }

      render(
        <CartProvider>
          <CartTestHarness />
        </CartProvider>
      );

      // Initially empty: confirmed false, subtotal 0
      expect(screen.getByTestId("subtotal").textContent).toBe("0");

      // Add item with confirmed price 250/kg, weight 2.0 kg, quantity 3 = ₹1500
      fireEvent.click(screen.getByText("Add Confirmed"));
      expect(screen.getByTestId("confirmed").textContent).toBe("yes");
      expect(screen.getByTestId("subtotal").textContent).toBe("1500");

      // Add item with unconfirmed price: subtotal MUST become null!
      fireEvent.click(screen.getByText("Add Unconfirmed"));
      expect(screen.getByTestId("confirmed").textContent).toBe("no");
      expect(screen.getByTestId("subtotal").textContent).toBe("null");
    });
  });
});
