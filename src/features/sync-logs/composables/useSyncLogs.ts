import { ref, computed } from "vue";
import { systemApi } from "@/shared/api";
import type { SyncLog } from "@/shared/types";
import type { SelectOption } from "@/shared/ui/select-filter/types";
import { formatNumber } from "@/shared/lib/formatters";

export function useSyncLogs() {
  const logs = ref<SyncLog[]>([]);
  const selectedType = ref<string>("");
  const selectedStatus = ref<string>("");
  const currentPage = ref<number>(1);
  const pageSize = 30;

  const typeOptions: SelectOption[] = [
    { value: "", label: "Все типы" },
    { value: "orders", label: "Заказы" },
    { value: "remains", label: "Остатки" },
    { value: "cards", label: "Карточки" },
    { value: "moysklad", label: "МойСклад" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "", label: "Все статусы" },
    { value: "success", label: "Успешно" },
    { value: "error", label: "Ошибка" },
  ];

  const filteredLogs = computed<SyncLog[]>(() =>
    logs.value.filter((log) => {
      if (selectedType.value && log.entityType !== selectedType.value)
        return false;
      if (selectedStatus.value && log.status !== selectedStatus.value)
        return false;
      return true;
    }),
  );

  const statsData = computed(() => {
    const filtered = filteredLogs.value;
    const total = filtered.length;
    const success = filtered.filter((l) => l.status === "success").length;
    const error = filtered.filter((l) => l.status === "error").length;
    const successRate = total ? Math.round((success / total) * 100) : 0;
    return [
      { label: "Всего запусков", value: formatNumber(total) },
      { label: "Успешно", value: formatNumber(success) },
      { label: "Ошибок", value: formatNumber(error) },
      { label: "Успешность", value: successRate + "%" },
    ];
  });

  const totalPages = computed(() =>
    Math.ceil(filteredLogs.value.length / pageSize),
  );
  const paginatedLogs = computed(() =>
    filteredLogs.value.slice(
      (currentPage.value - 1) * pageSize,
      currentPage.value * pageSize,
    ),
  );

  async function fetchLogs(): Promise<void> {
    const res = await systemApi.getSyncLogs({ limit: 1000 });
    logs.value = res.data;
  }

  return {
    logs,
    selectedType,
    selectedStatus,
    currentPage,
    pageSize,
    typeOptions,
    statusOptions,
    filteredLogs,
    statsData,
    totalPages,
    paginatedLogs,
    fetchLogs,
  };
}
