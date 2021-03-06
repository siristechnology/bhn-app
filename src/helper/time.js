import moment from 'moment'
import { convertNos } from './dateConverter'
import { addLeadingZero } from './utils'

moment.updateLocale('en', {
	relativeTime: {
		past: '%s ago',
		m: '1 minute',
		mm: '%d minute',
		h: '1 hour',
		hh: '%d hour',
		d: '1 day',
		dd: '%d day',
	},
})
export const getRelativeTime = (date) => {
	const convertedDate = Number(date)
	if (!isNaN(convertedDate) && typeof convertedDate === 'number') {
		return moment(convertedDate).startOf('hour').fromNow()
	} else {
		return moment(date).startOf('hour').fromNow()
	}
}

export const getCurrentTime = () => {
	let hours = moment().hours()
	let minutes = moment().minutes()

	if (hours < 10) {
		hours = addLeadingZero(hours)
	}
	if (minutes < 10) {
		minutes = addLeadingZero(minutes)
	}
	const currentTime = `${hours}:${minutes}`
	const currentTimeInNepali = []
	for (const letter of currentTime) {
		if (letter == ':') {
			currentTimeInNepali.push(letter)
		} else {
			currentTimeInNepali.push(convertNos(letter))
		}
	}
	return currentTimeInNepali.join('')
}
