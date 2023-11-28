<script setup lang="ts">
import { computed, inject } from 'vue';
import {
  DEFAULT_VIRTUAL_COLUMN_TABLE_COLGROUP, virtualColumnColgroupKey
} from '@/components/virtualColumnPaginationTable/VirtualColumnTableInjectKeys';

interface Props {
  totalColumnSize: number;
  firstColumnIndex: number;
  firstWidth: number;
  lastWidth: number;
  step: number;
  eachElementWidth: number;
}

const props = defineProps<Props>();

const injectColgroup = inject(virtualColumnColgroupKey, DEFAULT_VIRTUAL_COLUMN_TABLE_COLGROUP);

const getFirstWidth = computed(() => {
  const {firstHeadersWithoutRowspanOfTwo, firstHeadersWithRowspanOfTwoWidth} = injectColgroup;
  const {firstColumnIndex, firstWidth} = props;

  return firstColumnIndex >= firstHeadersWithoutRowspanOfTwo.value ? firstHeadersWithRowspanOfTwoWidth + firstWidth : firstWidth;
});

const getColgroupWidths = computed(() => {
  const {totalColumnSize, firstColumnIndex, step, eachElementWidth, firstWidth} = props;
  const {firstHeaderWidths, firstHeadersWithRowspanOfTwo} = injectColgroup;
  const widths = firstHeaderWidths.value
                                  .map((width, index) => ({
                                    id: index + 1,
                                    width: firstColumnIndex === 0 ? width :
                                      width < eachElementWidth ? eachElementWidth : width
                                  }));
  const startId = widths.length + 1;

  for (let i = startId, max = totalColumnSize + startId; i < max; i++) {
    widths.push({id: i, width: eachElementWidth});
  }

  const addingEnd = firstWidth < eachElementWidth * firstHeadersWithRowspanOfTwo.value ? firstHeadersWithRowspanOfTwo.value : 0;
  const end = firstColumnIndex + step >= totalColumnSize ? totalColumnSize + addingEnd : firstColumnIndex + step;

  return widths.slice(firstColumnIndex, end);
});
</script>

<template>
  <colgroup>
    <col :style="{width: `${getFirstWidth}px`}">
    <col
      v-for="widthObj in getColgroupWidths"
      :key="widthObj.id"
      :style="{width: `${widthObj.width}px`}"
    />
    <col :style="{width: `${lastWidth}px`}">
  </colgroup>
</template>
