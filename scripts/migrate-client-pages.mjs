import fs from "fs";
import path from "path";

const ROOT = path.resolve("app");

const ROUTE_META = {
  "my-wallet": { title: "My Wallet - AstroCall", description: "Manage your AstroCall wallet balance and transactions", noindex: true },
  "my-chats": { title: "My Chats - AstroCall", description: "View your chat history with astrologers", noindex: true },
  "my-gemstone": { title: "My Gemstone Orders - AstroCall", description: "Track your gemstone orders", noindex: true },
  "my-following": { title: "My Following - AstroCall", description: "Astrologers you follow on AstroCall", noindex: true },
  "my-account/suggested": { title: "Suggested Items - AstroCall", description: "Personalized suggestions for your account", noindex: true },
  "wait-list": { title: "Waiting List - AstroCall", description: "View your waiting list sessions", noindex: true },
  suggested: { title: "Suggested Items - AstroCall", description: "Personalized suggestions", noindex: true },
  "checkout/address": { title: "Checkout Address - AstroCall", description: "Enter delivery address for your order", noindex: true },
  "checkout/payment": { title: "Checkout Payment - AstroCall", description: "Complete your gemstone purchase", noindex: true },
  plans: {
    title: "Recharge Plans - AstroCall",
    description: "Explore astrology consultation and wallet recharge plans",
    noindex: false,
    canonical: "/plans",
  },
  "plans/[recharge-amount]": { title: "Recharge Plan - AstroCall", description: "Complete your wallet recharge", noindex: true },
  "astrologer-panel/assign-puja": { title: "Assign Puja - AstroCall", description: "Assign puja sessions", noindex: true },
  "astrologer-panel/bank-details": { title: "Bank Details - AstroCall", description: "Manage astrologer bank details", noindex: true },
  "astrologer-panel/call-history": { title: "Call History - AstroCall", description: "View your call history", noindex: true },
  "astrologer-panel/chat-history": { title: "Chat History - AstroCall", description: "View your chat history", noindex: true },
  "astrologer-panel/create-reel": { title: "Create Reel - AstroCall", description: "Create a new astrology reel", noindex: true },
  "astrologer-panel/followers": { title: "Followers - AstroCall", description: "View your followers", noindex: true },
  "astrologer-panel/my-reels": { title: "My Reels - AstroCall", description: "Manage your reels", noindex: true },
  "astrologer-panel/pending-list": { title: "Pending List - AstroCall", description: "View pending sessions", noindex: true },
  "astrologer-panel/profile": { title: "Astrologer Profile - AstroCall", description: "Manage your astrologer profile", noindex: true },
  "astrologer-panel/reviews": { title: "Reviews - AstroCall", description: "View customer reviews", noindex: true },
  "astrologer-panel/settings": { title: "Settings - AstroCall", description: "Astrologer panel settings", noindex: true },
  "astrologer-panel/suggested-mall": { title: "Suggested Mall - AstroCall", description: "Suggested mall items", noindex: true },
  "astrologer-panel/suggested-puja": { title: "Suggested Puja - AstroCall", description: "Suggested puja items", noindex: true },
  "astrologer-panel/waiting-list": { title: "Waiting List - AstroCall", description: "Manage waiting list", noindex: true },
  "astrologer-panel/wallet": { title: "Astrologer Wallet - AstroCall", description: "Manage your earnings wallet", noindex: true },
  "astrologer-panel/astro-chat": { title: "Astrologer Chat - AstroCall", description: "Chat with users", noindex: true },
  "astrologer-panel/astro-chat/chat": { title: "Live Chat - AstroCall", description: "Live chat session", noindex: true },
  "astrologer-register": {
    title: "Become an Astrologer - AstroCall",
    description: "Register as an astrologer on AstroCall",
    noindex: false,
    canonical: "/astrologer-register",
  },
  "astrologer-register-update": { title: "Complete Astrologer Registration - AstroCall", description: "Finish your astrologer registration", noindex: true },
  "user-chat": { title: "User Chat - AstroCall", description: "Chat with astrologers", noindex: true },
  "user-chat/chat": { title: "Live Chat - AstroCall", description: "Live chat session", noindex: true },
  "chat-to-astrologers/user-chat-home": { title: "Start Chat - AstroCall", description: "Start a chat with an astrologer", noindex: true },
  "talk-to-astrologers/user-talk-home": { title: "Start Call - AstroCall", description: "Start a call with an astrologer", noindex: true },
};

const CLIENT_NAMES = {
  "my-wallet": "MyWalletClient",
  "my-chats": "MyChatsClient",
  "my-gemstone": "MyGemstoneClient",
  "my-following": "MyFollowingClient",
  "my-account/suggested": "MyAccountSuggestedClient",
  "wait-list": "WaitListClient",
  suggested: "SuggestedClient",
  "checkout/address": "CheckoutAddressClient",
  "checkout/payment": "CheckoutPaymentClient",
  plans: "PlansClient",
  "plans/[recharge-amount]": "PlanRechargeClient",
  "astrologer-panel/assign-puja": "AssignPujaClient",
  "astrologer-panel/bank-details": "BankDetailsClient",
  "astrologer-panel/call-history": "CallHistoryClient",
  "astrologer-panel/chat-history": "ChatHistoryClient",
  "astrologer-panel/create-reel": "CreateReelClient",
  "astrologer-panel/followers": "FollowersClient",
  "astrologer-panel/my-reels": "MyReelsClient",
  "astrologer-panel/pending-list": "PendingListClient",
  "astrologer-panel/profile": "ProfileClient",
  "astrologer-panel/reviews": "ReviewsClient",
  "astrologer-panel/settings": "SettingsClient",
  "astrologer-panel/suggested-mall": "SuggestedMallClient",
  "astrologer-panel/suggested-puja": "SuggestedPujaClient",
  "astrologer-panel/waiting-list": "WaitingListClient",
  "astrologer-panel/wallet": "AstrologerWalletClient",
  "astrologer-panel/astro-chat": "AstroChatClient",
  "astrologer-panel/astro-chat/chat": "AstroChatSessionClient",
  "astrologer-register": "AstrologerRegisterClient",
  "astrologer-register-update": "AstrologerRegisterUpdateClient",
  "user-chat": "UserChatClient",
  "user-chat/chat": "UserChatSessionClient",
  "chat-to-astrologers/user-chat-home": "UserChatHomeClient",
  "talk-to-astrologers/user-talk-home": "UserTalkHomeClient",
};

function findClientPages(dir = ROOT, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findClientPages(full, acc);
    } else if (entry.name === "page.js" || entry.name === "page.jsx") {
      const content = fs.readFileSync(full, "utf8");
      if (content.startsWith('"use client"') || content.startsWith("'use client'")) {
        acc.push(full);
      }
    }
  }
  return acc;
}

function routeKeyFromPath(pagePath) {
  const rel = path.relative(ROOT, path.dirname(pagePath)).replace(/\\/g, "/");
  return rel;
}

function buildMetadataBlock(meta, routeKey) {
  const SITE = "https://astrocall.live";
  const canonicalPath = meta.canonical || `/${routeKey}`;
  const canonical = `${SITE}${canonicalPath}`;

  const robots = meta.noindex
    ? "  robots: { index: false, follow: false },"
    : "  robots: { index: true, follow: true },";

  if (meta.noindex) {
    return `export const metadata = {
  title: ${JSON.stringify(meta.title)},
  description: ${JSON.stringify(meta.description)},
${robots}
};`;
  }

  return `const SITE = "https://astrocall.live";
const CANONICAL = ${JSON.stringify(canonical)};

export const metadata = {
  title: ${JSON.stringify(meta.title)},
  description: ${JSON.stringify(meta.description)},
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: ${JSON.stringify(meta.title)},
    description: ${JSON.stringify(meta.description)},
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: ${JSON.stringify(meta.title)},
    description: ${JSON.stringify(meta.description)},
  },
${robots}
};`;
}

function stripSeoFromClient(content) {
  return content
    .replace(/import SEO from ["'][^"']+["'];\n?/g, "")
    .replace(/<SEO[\s\S]*?\/>\n?/g, "")
    .replace(/<SEO[\s\S]*?>[\s\S]*?<\/SEO>\n?/g, "");
}

function migratePage(pagePath) {
  const routeKey = routeKeyFromPath(pagePath);
  const clientName = CLIENT_NAMES[routeKey];
  const meta = ROUTE_META[routeKey];

  if (!clientName || !meta) {
    console.warn(`SKIP (no config): ${routeKey}`);
    return false;
  }

  const dir = path.dirname(pagePath);
  const clientPath = path.join(dir, `${clientName}.jsx`);
  let content = fs.readFileSync(pagePath, "utf8");
  content = stripSeoFromClient(content);

  if (fs.existsSync(clientPath)) {
    console.warn(`SKIP (client exists): ${clientPath}`);
    return false;
  }

  fs.writeFileSync(clientPath, content, "utf8");

  const pageName = clientName.replace(/Client$/, "Page");
  const serverPage = `import ${clientName} from "./${clientName}";

${buildMetadataBlock(meta, routeKey)}

export default function ${pageName}() {
  return <${clientName} />;
}
`;

  fs.writeFileSync(pagePath, serverPage, "utf8");
  console.log(`MIGRATED: ${routeKey} -> ${clientName}.jsx`);
  return true;
}

const pages = findClientPages();
let count = 0;
for (const p of pages) {
  if (migratePage(p)) count++;
}
console.log(`\nDone. Migrated ${count}/${pages.length} pages.`);
