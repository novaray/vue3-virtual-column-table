import type { Ref } from 'vue';
import { computed, nextTick, ref } from 'vue';

export const useVirtualColumnTable = (
  totalRegularColumnSize: Ref<number>,
  irregularElementWidths: Ref<number[]>,
  eachRegularColumnSize: Ref<number>,
  stepMargin: Ref<number>
) => {
  const tableWrapperRef = ref<HTMLElement | null>(null);
  const step = ref(1);
  const firstColumnIndex = ref(0);
  const firstColumnWidth = ref(0);
  const lastColumnWidth = ref(0);
  
  
  const getTotalIrregularElementWidths = computed(() => {
    const totalWidths = irregularElementWidths.value.reduce((acc, cur) => acc + cur, 0);
    const remainder = totalWidths % eachRegularColumnSize.value;
    
    return totalWidths + eachRegularColumnSize.value - remainder;
  });
  
  const calculateEmptySpace = () => {
    const left = tableWrapperRef.value?.scrollLeft ?? 0;
    const viewportX = tableWrapperRef.value?.clientWidth ?? 0;
    
    if (left > 0) {
      step.value = Math.floor((viewportX + getTotalIrregularElementWidths.value) / (eachRegularColumnSize.value - stepMargin.value));
      firstColumnIndex.value = left < getTotalIrregularElementWidths.value ?
        0 : Math.floor((left - getTotalIrregularElementWidths.value) / eachRegularColumnSize.value);
    } else {
      firstColumnIndex.value = 0;
      step.value = Math.floor((viewportX + getTotalIrregularElementWidths.value) / (eachRegularColumnSize.value - stepMargin.value));
    }
    
    nextTick(() => {
      firstColumnWidth.value = firstColumnIndex.value * eachRegularColumnSize.value < 0 ?
        0 : firstColumnIndex.value * eachRegularColumnSize.value;
      lastColumnWidth.value = firstColumnIndex.value + step.value > totalRegularColumnSize.value ? 0 :
        (totalRegularColumnSize.value * eachRegularColumnSize.value) - step.value * eachRegularColumnSize.value - firstColumnWidth.value;
    });
  };
  
  return {
    tableWrapperRef,
    step,
    firstColumnIndex,
    firstColumnWidth,
    lastColumnWidth,
    
    calculateEmptySpace
  }
};
