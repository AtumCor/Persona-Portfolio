// Template content: edit this file to personalize your own portfolio.
// Never commit private phone numbers or assets without permission.
export const site = {
  owner: {
    name: "YOUR NAME",
    portfolioName: "CREATIVE PORTFOLIO",
    profileImage: `${import.meta.env.BASE_URL}images/profile/profile.svg`,
    profileImageFallback: `${import.meta.env.BASE_URL}images/profile/profile.svg`,
  },
  hero: {
    titleTop: "MAKE",
    titleAccent: "SOMETHING",
    titleBottom: "LOUD.",
    intro: "A home for creative projects, images, and experiments.",
    buttonText: "ENTER THE ARCHIVE",
    sticker: { text: ["SELECT", "YOUR", "PATH"], number: "NO. 00" },
    footerText: "SCROLL TO INVESTIGATE",
    year: "2026",
  },
  navigation: [
    { index: "01", label: "WORK", section: "work" },
    { index: "02", label: "ABOUT", section: "about" },
    { index: "03", label: "CONTACT", section: "contact" },
  ],
  about: {
    number: "01", kicker: "PROFILE DATA ///", title: "ABOUT",
    statusLabel: "STATUS", statusValue: "ACTIVE",
    portraitLabel: "PORTRAIT", portraitSubLabel: "/ CHARACTER ART /",
    portraitImage: `${import.meta.env.BASE_URL}images/profile/about-profile.svg`,
    playerTag: "PLAYER 00", identityLabel: "IDENTITY ///",
    headingTop: "CREATIVE", headingBottom: "PROFILE",
    bio: "Introduce yourself here. Describe your interests, your creative practice, and the types of projects you want to share.",
    specialties: ["ART DIRECTION", "PHOTOGRAPHY", "DESIGN", "DEVELOPMENT"],
    stats: [
      { label: "CREATIVE DIRECTION", value: 85 },
      { label: "DEVELOPMENT", value: 85 },
      { label: "DESIGN", value: 85 },
      { label: "EXPERIMENTATION", value: 85 },
    ],
    footerLabel: "PROFILE // 01", footerMessage: "KEEP MAKING WEIRD THINGS.",
  },
  work: {
    number: "02", kicker: "CASE FILES ///", heading: "WORK",
    noteTop: "SELECT A FILE", noteBottom: "TO INVESTIGATE",
    hoverNote: "INVESTIGATE", openButton: "OPEN CASE",
    imagePlaceholder: "PROJECT IMAGE",
  },
  contact: {
    number: "03", kicker: "FINAL TRANSMISSION ///",
    titleTop: "GET IN", titleBottom: "TOUCH.",
    statusLabel: "CHANNEL", statusValue: "OPEN",
    messageLabel: "MESSAGE ///", intro: "LET'S TALK!",
    subtext: "Replace these example contact details before publishing your own site.",
    email: "hello@example.com", buttonText: "SEND A MESSAGE",
    links: [
      { label: "EMAIL", value: "hello@example.com", href: "mailto:hello@example.com" },
      { label: "WEBSITE", value: "example.com", href: "https://example.com" },
      { label: "GITHUB", value: "YOUR-USERNAME", href: "https://github.com/your-username" },
    ],
    finalLabel: "END OF FILE ///", finalMessageTop: "LET'S MAKE",
    finalMessageBottom: "SOMETHING LOUD.", footerLabel: "03 / CONTACT",
  },
} as const;
