export const getFormattedDateAndTime = (date?: number | Date) => {
	const now = date ? new Date(date) : new Date();

	now.setHours(now.getHours() - 3);

	return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${now.getFullYear()} às ${now
		.getHours()
		.toString()
		.padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};
