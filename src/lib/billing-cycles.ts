export interface GeneratedBillingCycle {
	label: string;
	startDateISO: string; // YYYY-MM-DD
	endDateISO: string;   // YYYY-MM-DD
	monthIndex: number;   // 0-11 for the displayed month
}

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const MONTH_ABBR = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function generateBillingCyclesForYear(year: number): GeneratedBillingCycle[] {
	const cycles: GeneratedBillingCycle[] = [];
	for (let m = 0; m < 12; m += 1) {
		const currentYear = year;
		const currentMonthName = MONTH_NAMES[m];
		const currentMonthAbbr = MONTH_ABBR[m];

		// previous month and year
		const prevMonthIndex = (m + 11) % 12;
		const prevMonthYear = m === 0 ? year - 1 : year;
		const prevMonthAbbr = MONTH_ABBR[prevMonthIndex];

		// ISO dates
		const startDateISO = new Date(Date.UTC(prevMonthYear, prevMonthIndex, 21)).toISOString().slice(0, 10);
		const endDateISO = new Date(Date.UTC(currentYear, m, 20)).toISOString().slice(0, 10);

		const label = `${currentMonthName} ${year} (21 ${prevMonthAbbr} - 20 ${currentMonthAbbr})`;
		cycles.push({ label, startDateISO, endDateISO, monthIndex: m });
	}
	return cycles;
}










