export interface NavItem {
  label: string;
  href: string;
  number: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  { label: "Home", href: "/", number: "01" },
  {
    label: "Solutions",
    href: "/solutions",
    number: "02",
    children: [
      { label: "Yachts", href: "/solutions/yachts", number: "" },
      { label: "Casinos", href: "/solutions/casinos", number: "" },
      { label: "Restaurants", href: "/solutions/restaurants", number: "" },
      { label: "Hotels", href: "/solutions/hotels", number: "" },
    ],
  },
  { label: "About", href: "/about", number: "03" },
  { label: "Story", href: "/story", number: "04" },
  { label: "Blog", href: "/blog", number: "05" },
  { label: "Contact", href: "/contact", number: "06" },
];
