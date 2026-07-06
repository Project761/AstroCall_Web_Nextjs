import {
  FaThLarge,
  FaUser,
  FaWallet,
  FaComments,
  FaPhone,
  FaHeart,
  FaUserCheck,
  FaGem,
  FaPrayingHands,
  FaLightbulb,
  FaListUl,
  FaBookOpen,
  FaTag,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";

export const ORANGE = "#FF5C00";
export const CREAM = "#FFF9F1";

/** All user-panel pages — original routes preserved */
export const USER_PANEL_NAV = [
  { label: "My Dashboard", href: "/my-account", icon: FaThLarge },
  { label: "My Profile", href: "/my-account/edit-profile", icon: FaUser },
  { label: "My Wallet", href: "/my-wallet", icon: FaWallet },
  { label: "My Chats", href: "/my-chats", icon: FaComments },
  { label: "My Calls", href: "/my-calls", icon: FaPhone },
  { label: "My Favorites", href: "/my-favorites", icon: FaHeart },
  { label: "My Following", href: "/my-following", icon: FaUserCheck },
  { label: "My Gemstone", href: "/my-gemstone", icon: FaGem },
  { label: "My Online Puja", href: "/my-online-puja", icon: FaPrayingHands },
  { label: "Suggested", href: "/my-account/suggested", icon: FaLightbulb },
  { label: "Wait List", href: "/wait-list", icon: FaListUl },
  // { label: "My Kundlis", href: "/freekundli", icon: FaBookOpen },
  // { label: "Recharge Plans", href: "/plans", icon: FaTag },
  { label: "Support", href: "/support", icon: FaHeadset },
];

export const LOGOUT_NAV = { label: "Logout", icon: FaSignOutAlt };

export function isPanelNavActive(pathname, href) {
  if (href === "/my-account") return pathname === "/my-account";
  if (href === "/my-account/edit-profile") return pathname === "/my-account/edit-profile";
  if (href === "/my-account/suggested") return pathname.startsWith("/my-account/suggested");
  if (href === "/freekundli") return pathname.startsWith("/freekundli");
  if (href === "/plans") return pathname.startsWith("/plans");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPanelPageTitle(pathname) {
  const item = USER_PANEL_NAV.find((n) => isPanelNavActive(pathname, n.href));
  return item?.label || "User Panel";
}

export function isUserPanelRoute(pathname) {
  return (
    pathname.startsWith("/my-") ||
    pathname === "/wait-list" ||
    pathname === "/support"
  );
}

export function calcProfileCompletion(user) {
  if (!user) return { percent: 0, tasks: [] };
  const tasks = [
    { label: "Add Basic Information", done: Boolean(user.FirstName && user.LastName && user.DOB) },
    { label: "Verify Mobile Number", done: Boolean(user.MobileNo && String(user.MobileNo).length >= 10) },
    { label: "Upload Profile Picture", done: Boolean(user.ProfilePic) },
    { label: "Add Birth Details", done: Boolean(user.POB && user.TOB) },
    { label: "Add Preferences", done: Boolean(user.Gender && user.MaritalStatus) },
  ];
  const done = tasks.filter((t) => t.done).length;
  const percent = Math.round((done / tasks.length) * 100);
  return { percent, tasks };
}
