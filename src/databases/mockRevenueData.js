export const revenueMock7Days = [
  { date: "02 Jan", direct: 42, organic: 12, referral: 8 },
  { date: "03 Jan", direct: 53, organic: 22, referral: 15 },
  { date: "04 Jan", direct: 38, organic: 18, referral: 12 },
  { date: "05 Jan", direct: 67, organic: 8, referral: 14 },
  { date: "06 Jan", direct: 20, organic: 12, referral: 18 },
  { date: "07 Jan", direct: 41, organic: 28, referral: 13 },
  { date: "08 Jan", direct: 50, organic: 15, referral: 10 },
];

export const revenueMock30Days = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1} Jan`,
  direct: Math.floor(Math.random() * 100),
  organic: Math.floor(Math.random() * 50),
  referral: Math.floor(Math.random() * 30),
}));

export const revenueMock90Days = Array.from({ length: 90 }, (_, i) => ({
  date: `${i + 1} Jan`,
  direct: Math.floor(Math.random() * 100),
  organic: Math.floor(Math.random() * 50),
  referral: Math.floor(Math.random() * 30),
}));
