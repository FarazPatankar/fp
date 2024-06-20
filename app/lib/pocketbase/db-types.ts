/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Categories = "categories",
	Entries = "entries",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CategoriesRecord = {
	slug: string
	title: string
}

export type EntriesRecord<Tmeta = unknown> = {
	category: RecordIdString
	content: HTMLString
	media?: string[]
	meta?: null | Tmeta
	slug: string
	title: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type EntriesResponse<Tmeta = unknown, Texpand = unknown> = Required<EntriesRecord<Tmeta>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	categories: CategoriesRecord
	entries: EntriesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	categories: CategoriesResponse
	entries: EntriesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'categories'): RecordService<CategoriesResponse>
	collection(idOrName: 'entries'): RecordService<EntriesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
