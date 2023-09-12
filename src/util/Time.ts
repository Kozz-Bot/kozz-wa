export const getFormattedDateAndTime = (date?: number | Date) => {
	// creating new date with -3 hours to use GMT -3;
	const now = date ? new Date(date) : new Date(new Date().getTime() - 1800000);

	return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${now.getFullYear()} às ${now
		.getHours()
		.toString()
		.padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};
