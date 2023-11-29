<script setup lang="ts">
import VirtualColumnTable from '@/components/virtualColumnPaginationTable/VirtualColumnTable.vue';
import { computed, h, nextTick, provide, ref } from 'vue';
import type { VirtualColumnTableHeader } from '@/components/virtualColumnPaginationTable/VirtualColumnTableInjectKeys';
import {
  virtualColumnColgroupKey, virtualColumnHeadersKey, virtualColumnTableBodyKey
} from '@/components/virtualColumnPaginationTable/VirtualColumnTableInjectKeys';
import {
  getVirtualColumnTableExampleData, getVirtualColumnTableExampleHeaders
} from '@/components/virtualColumnPaginationTable/VirtualColumnTableExampleData';

const EACH_REGULAR_COLUMN_SIZE = 100;
const COLUMN_SIZE = 2000 ;

const {exampleFirstHeaders, exampleSecondHeaders} = getVirtualColumnTableExampleHeaders(COLUMN_SIZE);
const firstHeaders = ref<VirtualColumnTableHeader[]>(exampleFirstHeaders);
const secondHeaders = ref<VirtualColumnTableHeader[]>(exampleSecondHeaders);
const totalRegularColumnSize = ref<number>(0);
const dataList = ref<any[]>([]);

const getFirstHeaderWidths = computed((): number[] =>
  firstHeaders.value.filter(header => Object.prototype.hasOwnProperty.call(header, 'width')).map((header) => header.width!)
);
const getFirstHeadersWithoutRowspanOfTwo = computed(() => firstHeaders.value.filter(header => (header?.rowspan ?? 1) < 2).length);
const getFirstHeadersWithRowspanOfTwo = computed(() => firstHeaders.value.filter(header => (header?.rowspan ?? 1) === 2).length);

provide(virtualColumnColgroupKey, {
  firstHeaderWidths: getFirstHeaderWidths,
  firstHeadersWithoutRowspanOfTwo: getFirstHeadersWithoutRowspanOfTwo,
  firstHeadersWithRowspanOfTwo: getFirstHeadersWithRowspanOfTwo,
  firstHeadersWithRowspanOfTwoWidth: 365
});
provide(virtualColumnHeadersKey, {
  firstHeaders,
  secondHeaders,
  primaryKeyName: 'id'
});
provide(virtualColumnTableBodyKey, {
  rows: dataList,
  cellRenderer: (row: any) => h('div', {
    class: 'cell',
    innerHTML: row?.label == null || row.label === '' ? row : row.label
  }),
  primaryKeyName: 'no',
  firstHeadersWithoutRowspanOfTwo: getFirstHeadersWithoutRowspanOfTwo,
  startKeys: ['no', 'email', 'name'],
  startRegularKeyName: 'status::'
});

const init = () => {
  dataList.value = getVirtualColumnTableExampleData(30, COLUMN_SIZE);
  nextTick(() => totalRegularColumnSize.value = COLUMN_SIZE + 1);
};

init();
</script>

<template>
  <main>
    <VirtualColumnTable
      :total-regular-column-size="totalRegularColumnSize"
      :each-regular-column-size="EACH_REGULAR_COLUMN_SIZE"
      :irregular-element-widths="[65, 300, 80]"
    />
  </main>
</template>
