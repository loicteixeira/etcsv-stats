import { writable } from 'svelte/store';
import type { TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';

export const orderItems = writable<TOrderItemCsvLine[]>([]);
export const orderItemCSVs = writable<TFileInfo[]>([]);

export const orders = writable<TOrderCsvLine[]>([]);
export const orderCSVs = writable<TFileInfo[]>([]);
