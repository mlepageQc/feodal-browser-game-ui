import Locale from '@/types/Locale'

export default interface User {
	id: string
	name: string
	email: string
	locale: Locale
	createdAt: string
	updatedAt: string
}
