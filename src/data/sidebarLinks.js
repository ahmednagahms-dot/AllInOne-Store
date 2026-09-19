export const sidebarLinks = [
  {
    section: "navigation.sections.main",
    items: [
      { label: "navigation.dashboard", path: "/dashboard", icon: "LayoutDashboard" },
      { label: "navigation.products", path: "/dashboard/products", icon: "Package" },
      { label: "navigation.addProduct", path: "/dashboard/products/new", icon: "PackagePlus" },
      { label: "navigation.categories", path: "/dashboard/categories", icon: "Layers" },
      { label: "navigation.orders", path: "/dashboard/orders", icon: "FileText" },
      { label: "navigation.carts", path: "/dashboard/carts", icon: "ShoppingCart" },
      { label: "navigation.users", path: "/dashboard/users", icon: "Users" },
      { label: "navigation.reviews", path: "/dashboard/reviews", icon: "Star" },
      { label: "navigation.wishlists", path: "/dashboard/wishlists", icon: "Heart" },
    ],
  },
  {
    section: "navigation.sections.marketing",
    items: [
      { label: "navigation.coupons", path: "/dashboard/coupons", icon: "Tag" },
    ],
  },
  {
    section: "navigation.sections.communication",
    items: [
      { label: "navigation.notifications", path: "/dashboard/notifications", icon: "Bell" },
    ],
  },
  {
    section: "navigation.sections.settings",
    items: [
      { label: "navigation.profile", path: "/dashboard/profile", icon: "User" },
      { label: "navigation.settings", path: "/dashboard/settings", icon: "Settings" },
    ],
  },
];