//#region src/lib/jaytalk.ts
var ECONOMY = {
	channel: 2e3,
	follow: 25,
	like: 15,
	dislike: 12,
	comment: 10,
	view: 5,
	photo: 80,
	welcome: 250,
	streakPerDay: 100,
	streakWeekBonus: 250
};
var PACKS = [
	{
		bucks: 1e3,
		naira: 100
	},
	{
		bucks: 5e3,
		naira: 500
	},
	{
		bucks: 1e4,
		naira: 1e3
	},
	{
		bucks: 5e4,
		naira: 5e3
	}
];
var WHATSAPP = "2348164584620";
var WHATSAPP_DISPLAY = "08164584620";
var PORTFOLIO = [
	{
		slug: "j2-bot",
		name: "J2 Bot Chat App",
		blurb: "An AI chat platform for real conversations and quick help.",
		url: "https://j2bot.netlify.app",
		category: "AI & Technology"
	},
	{
		slug: "edunova",
		name: "Edunova Learning",
		blurb: "Student learning, school management, and digital classrooms.",
		url: "https://edunova2026.netlify.app",
		category: "Education"
	},
	{
		slug: "becky",
		name: "Becky Apparel Store",
		blurb: "A fashion shop for browsing clothing collections.",
		url: "https://codewiz2025.github.io",
		category: "E-commerce"
	},
	{
		slug: "d37",
		name: "D37 Fashion Atelier",
		blurb: "Designs, bookings, and a home for the D37 brand.",
		url: "https://codewiz2025.github.io",
		category: "E-commerce"
	},
	{
		slug: "peach-glow",
		name: "Peach Glow Studio",
		blurb: "Flyers, logos, and branding from a creative studio.",
		url: "https://peachglow.netlify.app",
		category: "Creative"
	},
	{
		slug: "viora",
		name: "Viora Handmade",
		blurb: "A storefront for handmade crafts and one-of-a-kind pieces.",
		url: "https://chiworld-studio.netlify.app",
		category: "E-commerce"
	},
	{
		slug: "grain-rich",
		name: "Grain Rich",
		blurb: "Organic grains, food products, and Nigerian delicacies.",
		url: "https://codewiz2025.github.io",
		category: "Business"
	},
	{
		slug: "j2bot-pro",
		name: "J2Bot Pro",
		blurb: "A sharper AI chatbot for longer, smarter conversations.",
		url: "https://j2botpro.lovable.app",
		category: "AI & Technology"
	},
	{
		slug: "jayfp",
		name: "JayTech Football",
		blurb: "Football management, stats, and match-day info.",
		url: "https://jayfp.lovable.app",
		category: "Sports"
	},
	{
		slug: "echo-earth",
		name: "Echo Earth Explorer",
		blurb: "Nature, the environment, and stories from the planet.",
		url: "https://echoearth26.lovable.app",
		category: "AI & Technology"
	},
	{
		slug: "glory",
		name: "Glory & Honour Academy",
		blurb: "A school site with resources for students and teachers.",
		url: "https://glory-honour-academy.lovable.app",
		category: "Education"
	},
	{
		slug: "site-ai",
		name: "JayTech Site AI",
		blurb: "An AI website builder for launching a digital presence.",
		url: "https://jaytech-siteai.lovable.app",
		category: "AI & Technology"
	},
	{
		slug: "salon",
		name: "Salon Web Template",
		blurb: "Services, gallery, and appointment bookings for a salon.",
		url: "https://jaytech-salon-template.lovable.app",
		category: "Business"
	},
	{
		slug: "siftora",
		name: "Siftora Kids",
		blurb: "Learning made easier for young students.",
		url: "https://kids.siftora.com",
		category: "Education"
	},
	{
		slug: "dave-tech",
		name: "Dave Tech",
		blurb: "A technology brand site and its services.",
		url: "https://dave-tech.mobirisesite.com",
		category: "Business"
	},
	{
		slug: "knaps",
		name: "Knaps Academy",
		blurb: "A school promo site with programmes and presence.",
		url: "https://knapsacademy.com",
		category: "Education"
	},
	{
		slug: "pekaf",
		name: "Pekaf",
		blurb: "A business site introducing the Pekaf brand.",
		url: "https://pekaf.com",
		category: "Business"
	},
	{
		slug: "mathplus",
		name: "Mathplus Virtual Classes",
		blurb: "Online classes with a focus on mathematics.",
		url: "https://mathplus.club",
		category: "Education"
	},
	{
		slug: "peachpie",
		name: "PeachPie",
		blurb: "Trendy handmade pieces, made with love in Nigeria.",
		url: "https://peachpie.jaytech.online",
		category: "E-commerce"
	},
	{
		slug: "peachtech",
		name: "PeachTech",
		blurb: "Web, mobile, cloud, and AI engineering services.",
		url: "https://peachtech.jaytech.online",
		category: "Business"
	}
];
function formatBucks(amount) {
	return `${Math.round(amount).toLocaleString("en-NG")} Bucks`;
}
function transferAmount(value) {
	const n = Number(value);
	return /^\d+$/.test(value) && Number.isSafeInteger(n) && n > 0 ? n : null;
}
function lagosDate(offsetDays = 0, now = /* @__PURE__ */ new Date()) {
	const [y, m, d] = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Africa/Lagos",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now).split("-").map(Number);
	const utc = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
	utc.setUTCDate(utc.getUTCDate() + offsetDays);
	return utc.toISOString().slice(0, 10);
}
function lagosDayStart(now = /* @__PURE__ */ new Date()) {
	return (/* @__PURE__ */ new Date(`${lagosDate(0, now)}T00:00:00+01:00`)).toISOString();
}
function usernameOk(value) {
	return /^[a-zA-Z0-9_]{3,20}$/.test(value);
}
function waLink(bucks, naira) {
	const text = `Hi, I want to buy ${bucks.toLocaleString("en-NG")} JayTalk Bucks for ₦${naira.toLocaleString("en-NG")}.`;
	return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}
//#endregion
export { formatBucks as a, transferAmount as c, WHATSAPP_DISPLAY as i, usernameOk as l, PACKS as n, lagosDate as o, PORTFOLIO as r, lagosDayStart as s, ECONOMY as t, waLink as u };

//# sourceMappingURL=jaytalk-BUSANd3K.js.map