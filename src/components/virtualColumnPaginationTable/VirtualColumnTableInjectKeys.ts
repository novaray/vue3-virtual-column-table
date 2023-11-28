import type { ComputedRef, InjectionKey, Ref, VNode } from 'vue';
import { computed, h, ref } from 'vue';

export interface VirtualColumnTableColgroup {
  firstHeaderWidths: ComputedRef<number[]>;
  firstHeadersWithoutRowspanOfTwo: ComputedRef<number>;
  firstHeadersWithRowspanOfTwo: ComputedRef<number>;
  firstHeadersWithRowspanOfTwoWidth: number;
}

export interface VirtualColumnTableHeaders {
  firstHeaders: Ref<VirtualColumnTableHeader[]>;
  secondHeaders?: Ref<VirtualColumnTableHeader[]>;
  primaryKeyName: string;
}

export interface VirtualColumnTableHeader {
  id: number
  label: string;
  rowspan?: number;
  colspan?: number;
  width?: number;
}

export interface VirtualColumnTableBody {
  rows: Ref<any[]>;
  cellRenderer: (rowData: any, rowIndex: number) => VNode;
  primaryKeyName: string;
  firstHeadersWithoutRowspanOfTwo: ComputedRef<number>;
  startKeys: string[];
  startRegularKeyName: string;
}

export const virtualColumnColgroupKey = Symbol() as InjectionKey<VirtualColumnTableColgroup>;

export const virtualColumnHeadersKey = Symbol() as InjectionKey<VirtualColumnTableHeaders>;

export const virtualColumnTableBodyKey = Symbol() as InjectionKey<VirtualColumnTableBody>;

export const DEFAULT_VIRTUAL_COLUMN_TABLE_COLGROUP: VirtualColumnTableColgroup = Object.freeze({
  firstHeaderWidths: computed(() => []),
  firstHeadersWithoutRowspanOfTwo: computed(() => 0),
  firstHeadersWithRowspanOfTwo: computed(() => 0),
  firstHeadersWithRowspanOfTwoWidth: 0
});

export const DEFAULT_VIRTUAL_COLUMN_TABLE_HEADERS: VirtualColumnTableHeaders = Object.freeze({
  firstHeaders: ref([]),
  secondHeaders: ref([]),
  primaryKeyName: ''
});

export const DEFAULT_VIRTUAL_COLUMN_TABLE_BODY: VirtualColumnTableBody = Object.freeze({
  rows: ref([]),
  cellRenderer: () => h('div'),
  primaryKeyName: '',
  firstHeadersWithoutRowspanOfTwo: computed(() => 0),
  startKeys: [],
  startRegularKeyName: ''
});
