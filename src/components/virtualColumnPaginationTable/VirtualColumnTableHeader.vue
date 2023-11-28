<script setup lang="ts">
import { computed, inject } from 'vue';
import {
  DEFAULT_VIRTUAL_COLUMN_TABLE_HEADERS, virtualColumnHeadersKey, type VirtualColumnTableHeader
} from '@/components/virtualColumnPaginationTable/VirtualColumnTableInjectKeys';

interface Props {
  totalColumnSize: number;
  firstColumnIndex: number;
  step: number;
}

const props = defineProps<Props>();

const injectHeaders = inject(virtualColumnHeadersKey, DEFAULT_VIRTUAL_COLUMN_TABLE_HEADERS);

const getFirstColumnRowspan = computed(() => (injectHeaders.secondHeaders?.value ?? []).length > 0 ? 2 : 1);
const isShowSecondHeaders = computed(() => injectHeaders.secondHeaders && injectHeaders.secondHeaders.value.length > 0);
const getFirstHeaders = computed(() => {
  const {firstHeaders} = injectHeaders;
  const {firstColumnIndex, step} = props;
  if (firstHeaders.value.length === 0) {
    return [];
  }

  return firstColumnIndex >= firstHeaders.value.length ?
    [firstHeaders.value[firstHeaders.value.length - 1]] : firstHeaders.value.slice(firstColumnIndex, firstColumnIndex + step);
});
const getSecondHeaders = computed(() => {
  const {firstColumnIndex, step} = props;
  const length = getFirstHeaders.value.filter(firstHeader => Object.prototype.hasOwnProperty.call(firstHeader, 'rowspan')).length;
  const calc = firstColumnIndex === 0 ? 0 : firstColumnIndex - length;

  return injectHeaders.secondHeaders?.value.slice(calc, calc + step);
});
</script>

<template>
  <thead>
    <tr>
      <th
        :rowspan="getFirstColumnRowspan"
        scope="col"
      />
      <th
        v-for="header in getFirstHeaders ?? []"
        :key="header[injectHeaders.primaryKeyName as keyof VirtualColumnTableHeader]"
        :rowspan="header?.rowspan"
        :colspan="header?.colspan"
        scope="col"
      >
        <div class="cell">
          {{ header.label }}
        </div>
      </th>
      <th
        v-if="!isShowSecondHeaders"
        rowspan="2"
        scope="col"
      />
    </tr>
    <tr v-if="isShowSecondHeaders">
      <th
        v-for="header in getSecondHeaders"
        :key="header[injectHeaders.primaryKeyName as keyof VirtualColumnTableHeader]"
        :rowspan="header?.rowspan"
        :colspan="header?.colspan"
        scope="col"
      >
        <div class="cell">
          {{ header.label }}
        </div>
      </th>
      <th
        v-if="isShowSecondHeaders"
        scope="col"
      />
    </tr>
  </thead>
</template>
