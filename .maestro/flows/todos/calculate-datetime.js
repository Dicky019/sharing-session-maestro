// Calculate tomorrow's date and target time for todo creation
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

// Day number (e.g., "30")
output.TOMORROW_DAY = tomorrow.getDate().toString();

// Month abbreviation (e.g., "Oct")
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
output.TOMORROW_MONTH = months[tomorrow.getMonth()];

// Year (e.g., "2025")
output.TOMORROW_YEAR = tomorrow.getFullYear().toString();

// Target time: 23:18 (11:18 PM)
output.TARGET_HOUR = '23';
output.TARGET_MINUTE = '18';
output.TARGET_TIME = '23:18';

console.log('Calculated date:', output.TOMORROW_MONTH, output.TOMORROW_DAY, output.TOMORROW_YEAR);
console.log('Target time:', output.TARGET_TIME);
