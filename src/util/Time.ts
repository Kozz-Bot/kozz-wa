export const getFormattedDateAndTime = (date?: number | Date) => {
	const now = date ? new Date(date) : new Date();

	return `${now.getDay().toString().padStart(2, '0')}/${(now.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${now.getFullYear()} às ${(now.getHours() - 3)
		.toString()
		.padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};
