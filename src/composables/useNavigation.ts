import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "@/utilities/toast";
import { useI18n } from "@/stores/i18n/useI18n";

interface NavigationOptions<T> {
  fetchFirst: () => Promise<any>;
  fetchLast: () => Promise<any>;
  fetchNext: (id: number) => Promise<any>;
  fetchPrevious: (id: number) => Promise<any>;
  onSuccess: (data: T, id: number) => void;
  routeName: string;
  getCurrentId: () => number;
}

/**
 * Composable for navigation logic (First/Last/Next/Previous)
 * @param options - Navigation configuration options
 * @returns Navigation handler functions
 */
export function useNavigation<T>(options: NavigationOptions<T>) {
  const router = useRouter();
  const { t } = useI18n();
  const isLoading = ref(false);

  const handleNavigationResponse = (response: any) => {
    if (response.status === 200 && response.data.data) {
      const data = response.data.data;
      options.onSuccess(data, data.id);
      router.replace(`/${options.routeName}/edit/${data.id}`);
    }
    isLoading.value = false;
  };

  const handleError = (error: any) => {
    isLoading.value = false;
    const msg = error.response?.data?.message || t("general.notFound");
    showToast(msg, {
      description: msg,
      status: "error",
    });
  };

  const handleFirst = () => {
    isLoading.value = true;
    options.fetchFirst().then(handleNavigationResponse).catch(handleError);
  };

  const handleLast = () => {
    isLoading.value = true;
    options.fetchLast().then(handleNavigationResponse).catch(handleError);
  };

  const handleNext = () => {
    isLoading.value = true;
    options
      .fetchNext(options.getCurrentId())
      .then(handleNavigationResponse)
      .catch(handleError);
  };

  const handlePrevious = () => {
    isLoading.value = true;
    options
      .fetchPrevious(options.getCurrentId())
      .then(handleNavigationResponse)
      .catch(handleError);
  };

  return {
    isLoading,
    handleFirst,
    handleLast,
    handleNext,
    handlePrevious,
  };
}
