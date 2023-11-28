<script setup lang="ts">
import { inject } from 'vue';
import {
  DEFAULT_VIRTUAL_COLUMN_TABLE_BODY, virtualColumnTableBodyKey
} from '@/components/virtualColumnPaginationTable/VirtualColumnTableInjectKeys';

interface Props {
  totalColumnSize: number;
  firstColumnIndex: number;
  step: number;
  tableWrapperHeight: number;
  tableScrollHeight: number;
}

const props = defineProps<Props>();

const injectBody = inject(virtualColumnTableBodyKey, DEFAULT_VIRTUAL_COLUMN_TABLE_BODY);

const getRowValues = (row: any) => {
  const {firstHeadersWithoutRowspanOfTwo, startKeys, startRegularKeyName} = injectBody
  const {totalColumnSize, firstColumnIndex, step} = props;
  const addingCalc = firstColumnIndex >= firstHeadersWithoutRowspanOfTwo.value ? firstHeadersWithoutRowspanOfTwo.value : 0;
  const slices = Object.entries(row)
                       .filter(([key]) => startKeys.includes(key) || key.startsWith(startRegularKeyName))
                       .sort((a, b) => {
                         if (startKeys.includes(a[0]) && startKeys.includes(b[0])) {
                           // 둘 다 원하는 키일 경우, 원하는 키의 순서로 비교.
                           return startKeys.indexOf(a[0]) - startKeys.indexOf(b[0]);
                         } else if (startKeys.includes(a[0])) {
                           // a만 원하는 키일 경우, a를 먼저 오게 함.
                           return -1;
                         } else if (startKeys.includes(b[0])) {
                           // b만 원하는 키일 경우, b를 먼저 오게 함.
                           return 1;
                         }

                         const numA = parseInt((a[0]).split(startRegularKeyName)[1]);
                         const numB = parseInt((b[0]).split(startRegularKeyName)[1]);

                         return numA - numB;
                       })
                       .map(([, value]) => value)
                       .slice(firstColumnIndex + addingCalc, firstColumnIndex + step + addingCalc);

  if (slices.length < step) {
    const end = firstColumnIndex + step > totalColumnSize ? totalColumnSize: firstColumnIndex + step;
    const arrayLength = end - firstColumnIndex - slices.length < 0 ? 0 : end - firstColumnIndex - slices.length;
    const emptyArray = new Array(arrayLength).fill('');
    return [...slices, ...emptyArray];
  }

  return slices;
};

const getTrClass = (row: any) => row?.deleted ?? false ? 'delete-row' : '';

const getTdClass = (index: number) => {
  if (injectBody.rows.value.length - 1 !== index || props.tableWrapperHeight <= props.tableScrollHeight) {
    return '';
  }

  return 'non-border-bottom';
};
</script>

<template>
  <tbody>
    <tr
      v-for="(row, rowIndex) in injectBody.rows.value"
      :key="row[injectBody.primaryKeyName]"
      :class="getTrClass(row)"
    >
      <td></td>
      <td
        v-for="(value, index) in getRowValues(row)"
        :key="index"
        :class="getTdClass(rowIndex)"
      >
        <component :is="injectBody.cellRenderer(value, rowIndex)"/>
      </td>
      <td></td>
    </tr>
  </tbody>
</template>
