// lib/forecast/dates.ts
function parseDay(day) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function addDays(day, days) {
  const d = parseDay(day);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function monthAt(day, offset) {
  const d = parseDay(day);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + offset, 1)).toISOString().slice(0, 7);
}
function monthLabel(month) {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(parseDay(month + "-01"));
}

// lib/store/example.ts
function demoProfile() {
  const date = "2026-09-07", costs = [16e3, 16e3, 17e3, 19e3, 22e3, 24e3, 26e3, 24e3, 2e4, 18e3, 16e3, 16e3];
  const line = (id, label, values) => ({ id, label, type: "expense", amount: Math.round(values.reduce((a, b) => a + b, 0) / 12 * 100) / 100, monthlyAmounts: values });
  return { version: 1, example: true, demoAsOf: date, business: { id: "rivertide-dated-demo", name: "Example charter business", cashToday: 52400, minCashBuffer: 1e4, cashUpdatedAt: date + "T12:00:00.000Z", assumptionsUpdatedAt: date + "T12:00:00.000Z", createdAt: date + "T12:00:00.000Z" }, recurring: [{ id: "sales", label: "Charter bookings", type: "revenue", amount: 35e3, monthlyAmounts: [12e3, 12e3, 16e3, 38e3, 48e3, 6e4, 66e3, 6e4, 4e4, 28e3, 22e3, 18e3] }, line("premises", "Dockside premises and storage", costs.map(() => 5e3)), line("fuel", "Fuel and charter supplies", costs.map((n) => n * 0.25)), line("maintenance", "Routine maintenance and cleaning", costs.map((n) => n * 0.15)), line("crew", "Crew and operating support", costs.map((n) => n * 0.6 - 5e3))], upcoming: [{ id: "insurance", label: "Annual charter insurance premium", amount: 5400, dueDate: date, category: "bill" }, { id: "berth", label: "Harbor berth renewal", amount: 5400, dueDate: "2026-10-15", category: "bill" }, { id: "safety", label: "Safety equipment inspection and servicing", amount: 5400, dueDate: "2026-11-15", category: "bill" }, { id: "renewal", label: "Annual equipment and premises costs", amount: 3e4, dueDate: "2026-12-31", category: "bill" }, { id: "stock", label: "Seasonal stock commitment", amount: 24700, dueDate: "2027-01-15", category: "bill" }] };
}

// lib/forecast/availableToSpend.ts
function spendingCap(cash, obligations, buffer, reserve, low) {
  const snapshot = cash - obligations - buffer - reserve;
  const headroom = Math.max(0, low - buffer);
  return { available: Math.max(0, Math.min(snapshot, headroom)), snapshot, headroom };
}

// lib/forecast/engine.ts
var cents = (n) => Math.round(n * 100);
var dollars = (n) => n / 100;
function forecast(profile, today) {
  const start = cents(profile.business.cashToday), buffer = cents(profile.business.minCashBuffer);
  const date = parseDay(today), days = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  const fraction = (days - date.getUTCDate() + 1) / days;
  let cash = start, reserve = 0;
  const points = Array.from({ length: 12 }, (_, i) => {
    const month = monthAt(today, i), factor = i === 0 ? fraction : 1;
    const calendarMonth = Number(month.slice(5, 7)) - 1;
    const revenue = profile.recurring.filter((l) => l.type === "revenue").reduce((s, l) => s + cents(l.monthlyAmounts?.[calendarMonth] ?? l.amount), 0);
    const expenses = profile.recurring.filter((l) => l.type === "expense").reduce((s, l) => s + cents(l.monthlyAmounts?.[calendarMonth] ?? l.amount), 0);
    const r = Math.round(revenue * factor), e = Math.round(expenses * factor);
    const due = profile.upcoming.filter((item) => (item.dueDate < today ? today : item.dueDate).slice(0, 7) === month).reduce((s, l) => s + cents(l.amount), 0);
    cash += r - e - due;
    reserve += Math.max(0, e - r);
    return { month, label: monthLabel(month), projectedCash: dollars(cash), revenue: dollars(r), expenses: dollars(e), upcomingDue: dollars(due) };
  });
  const low = points.reduce((a, b) => b.projectedCash < a.projectedCash ? b : a);
  const lowCents = cents(low.projectedCash);
  const obligations = profile.upcoming.filter((item) => item.dueDate <= addDays(today, 90)).reduce((s, l) => s + cents(l.amount), 0);
  reserve = Math.min(reserve, buffer);
  const cap = spendingCap(start, obligations, buffer, reserve, lowCents);
  let strong = null;
  const lowIndex = points.indexOf(low);
  for (let i = lowIndex + 1; i < 11; i++) {
    if (points[i].projectedCash > points[i - 1].projectedCash && points[i + 1].projectedCash > points[i].projectedCash) {
      strong = points[i].month;
      break;
    }
  }
  const zero = points.findIndex((p) => p.projectedCash < 0);
  return { points, availableToSpend: dollars(cap.available), projectedLow: { amount: low.projectedCash, month: low.month }, nextStrongPeriod: strong, status: lowCents < buffer ? "below_buffer" : lowCents < buffer * 1.25 ? "at_risk" : "on_track", cashRunway: start < 0 ? 0 : zero < 0 ? null : zero, breakdown: { cash: dollars(start), obligations: dollars(obligations), buffer: dollars(buffer), seasonalReserve: dollars(reserve), snapshot: dollars(cap.snapshot), forecastHeadroom: dollars(cap.headroom) }, asOf: today };
}

// lib/forecast/scenario.ts
function purchaseScenario(profile, today, amount, dueDate) {
  if (!Number.isFinite(amount) || amount < 0 || amount > 1e9 || dueDate < today || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || isNaN(Date.parse(dueDate)) || new Date(dueDate).toISOString().slice(0, 10) !== dueDate) throw new Error("Enter a nonnegative purchase and a date from today forward.");
  const before = forecast(profile, today);
  const after = forecast({ ...profile, upcoming: [...profile.upcoming, { id: "scenario", label: "Hypothetical purchase", amount, dueDate, category: "planned_purchase" }] }, today);
  return { before, after, shortfall: Math.max(0, Math.round((profile.business.minCashBuffer - after.projectedLow.amount) * 100) / 100) };
}

// lib/forecast/savings.ts
function reducedCostProfile(profile, lineId, reduction) {
  const cut = Math.min(1e9, Math.max(0, Number.isFinite(reduction) ? reduction : 0));
  return { ...profile, recurring: profile.recurring.map((line) => {
    if (line.id !== lineId || line.type !== "expense") return line;
    const monthlyAmounts = line.monthlyAmounts?.map((n) => Math.round(Math.max(0, n - cut) * 100) / 100);
    return { ...line, monthlyAmounts, amount: monthlyAmounts ? Math.round(monthlyAmounts.reduce((a, b) => a + b, 0) / 12 * 100) / 100 : Math.round(Math.max(0, line.amount - cut) * 100) / 100 };
  }) };
}
export {
  demoProfile,
  forecast,
  purchaseScenario,
  reducedCostProfile
};
