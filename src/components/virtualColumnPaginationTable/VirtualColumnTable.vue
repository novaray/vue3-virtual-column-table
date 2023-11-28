<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, toRefs, watch } from 'vue';
import VirtualColumnTableColgroup from '@/components/virtualColumnPaginationTable/VirtualColumnTableColgroup.vue';
import VirtualColumnTableHeader from '@/components/virtualColumnPaginationTable/VirtualColumnTableHeader.vue';
import VirtualColumnTableBody from '@/components/virtualColumnPaginationTable/VirtualColumnTableBody.vue';
import { useVirtualColumnTable } from '@/composables/useVirtualColumnTable';

interface Props {
  totalRegularColumnSize: number;
  eachRegularColumnSize: number;
  irregularElementWidths?: number[];
  stepMargin?: number;
  useCriteria?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  irregularElementWidths: () => [],
  stepMargin: 10,
  useCriteria: true
});

const reactiveTotalRegularColumnSize = toRefs(props).totalRegularColumnSize;
const reactiveEachRegularColumnSize = toRefs(props).eachRegularColumnSize;
const reactiveIrregularElementWidths = toRefs(props).irregularElementWidths;
const reactiveStepMargin = toRefs(props).stepMargin;

const {
  tableWrapperRef,
  step,
  firstColumnIndex,
  firstColumnWidth,
  lastColumnWidth,

  calculateEmptySpace
} = useVirtualColumnTable(
  reactiveTotalRegularColumnSize,
  reactiveIrregularElementWidths,
  reactiveEachRegularColumnSize,
  reactiveStepMargin
);

const tableClass = ref(['non-full-text']);
const wrapperHeight = ref(0);
const scrollHeight = ref(0);

const getColgroupProps = computed(() => ({
  totalColumnSize: props.totalRegularColumnSize,
  firstColumnIndex: firstColumnIndex.value,
  firstWidth: firstColumnWidth.value,
  lastWidth: lastColumnWidth.value,
  step: step.value,
  eachElementWidth: props.eachRegularColumnSize,
}));

const getHeaderProps = computed(() => ({
  totalColumnSize: props.totalRegularColumnSize,
  firstColumnIndex: firstColumnIndex.value,
  step: step.value
}));

const getBodyProps = computed(() => ({
  totalColumnSize: props.totalRegularColumnSize,
  firstColumnIndex: firstColumnIndex.value,
  step: step.value,
  tableWrapperHeight: wrapperHeight.value,
  tableScrollHeight: scrollHeight.value
}));

watch(() => props.totalRegularColumnSize, (newTotalColumnSize) => {
  if (!newTotalColumnSize) {
    return;
  }

  initTable();
  tableWrapperRef.value?.addEventListener('scroll', onTableScroll);
  nextTick(() => {
    wrapperHeight.value = tableWrapperRef.value?.clientHeight ?? 0;
    scrollHeight.value = tableWrapperRef.value?.scrollHeight ?? 0;
  });
});

const initTable = () => calculateEmptySpace();

const onTableScroll = () => calculateEmptySpace();

onUnmounted(() => {
  tableWrapperRef.value?.removeEventListener('scroll', onTableScroll);
});
</script>

<template>
  <div class="table-container">
    <div class="table-wrap">
      <div
        ref="tableWrapperRef"
        class="table-scroll"
        style="height: calc(100vh - 292px);"
      >
        <div class="table-header-wrap">
          <table>
            <VirtualColumnTableColgroup v-bind="getColgroupProps"/>
            <VirtualColumnTableHeader v-bind="getHeaderProps"/>
          </table>
        </div>
        <div class="table-body-wrap">
          <table :class="tableClass">
            <VirtualColumnTableColgroup v-bind="getColgroupProps"/>
            <VirtualColumnTableBody v-bind="getBodyProps"/>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
