import { ref } from 'vue';
import Api from '@/api/apiConfig';

export function useUpload() {
  const isUploading = ref(false);
  const error = ref<string | null>(null);

  const uploadFile = async (file: File) => {
    isUploading.value = true;
    error.value = null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await Api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'File upload failed';
      return null;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    isUploading,
    error,
    uploadFile,
  };
}