import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InventoryPage from "../app/inventory/page";
import { updateDoc } from "firebase/firestore";

// Mock firebase
vi.mock("@/lib/firebase", () => ({
  db: { mock: "db" },
}));

// Mock firestore
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn((db, coll, id) => ({ id })),
  updateDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn((q, cb) => {
    cb({
      docs: [
        {
          id: "1",
          data: () => ({
            name: "Dumbbell",
            is_active: true,
            createdAt: { seconds: 1700000000 },
          }),
        },
        {
          id: "2",
          data: () => ({
            name: "Bands",
            is_active: true,
            createdAt: { seconds: 1700000000 },
          }),
        },
        {
          id: "3",
          data: () => ({
            name: "Archived Gear",
            is_active: false,
            createdAt: { seconds: 1700000000 },
          }),
        },
      ],
    });
    return () => {};
  }),
}));

// Mock Radix DropdownMenu to render content inline
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

// Mock framer-motion to avoid animation timing issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    tr: ({ children, className, ...props }: any) => (
      <tr className={className} {...props}>
        {children}
      </tr>
    ),
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("Inventory Page", () => {
  it("renders the inventory page header", () => {
    render(<InventoryPage />);
    expect(screen.getByText("Equipment Inventory")).toBeDefined();
    expect(
      screen.getByRole("tab", { name: /Operational \(2\)/i }),
    ).toBeDefined();
    expect(
      screen.getByRole("tab", { name: /Archived Vault \(1\)/i }),
    ).toBeDefined();
  });

  it("renders table column headers", () => {
    render(<InventoryPage />);
    const nameHeaders = screen.getAllByText("Name");
    expect(nameHeaders.length).toBeGreaterThan(0);
    const dateHeaders = screen.getAllByText("Date Added");
    expect(dateHeaders.length).toBeGreaterThan(0);
    const statusHeaders = screen.getAllByText("Status");
    expect(statusHeaders.length).toBeGreaterThan(0);
  });

  it("renders active items as table rows in the operational tab", () => {
    render(<InventoryPage />);
    expect(screen.getByText("Dumbbell")).toBeDefined();
    expect(screen.getByText("Bands")).toBeDefined();
    // Archived gear should not appear in the operational tab rows
    expect(screen.queryByText("Archived Gear")).toBeNull();
  });

  it("renders formatted date in rows", () => {
    render(<InventoryPage />);
    // seconds: 1700000000 → Nov 14, 2023
    const dates = screen.getAllByText(/Nov \d+, 2023/i);
    expect(dates.length).toBeGreaterThan(0);
  });

  it("renders a search input", () => {
    render(<InventoryPage />);
    expect(screen.getByPlaceholderText("Search gear...")).toBeDefined();
  });

  it("filters rows by search term", () => {
    render(<InventoryPage />);
    const searchInput = screen.getByPlaceholderText("Search gear...");
    fireEvent.change(searchInput, { target: { value: "Dumbbell" } });
    expect(screen.getByText("Dumbbell")).toBeDefined();
    expect(screen.queryByText("Bands")).toBeNull();
  });

  it("calls updateDoc when archive action is clicked", async () => {
    render(<InventoryPage />);
    const archiveBtns = screen.getAllByText("Archive");
    fireEvent.click(archiveBtns[0]);
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      is_active: false,
    });
  });
});
