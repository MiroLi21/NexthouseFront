import { h, render } from "vue";
import YesNoDialog from "@/components/general/YesNoDialog.vue";

export async function useYesNoDialog(opts: {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const cleanup = () => {
      render(null, el);
      el.remove();
    };

    const vnode = h(YesNoDialog, {
      open: true,
      title: opts.title,
      description: opts.description,
      confirmLabel: opts.confirmLabel,
      cancelLabel: opts.cancelLabel,
      onConfirm: () => {
        resolve(true);
        cleanup();
      },
      onCancel: () => {
        resolve(false);
        cleanup();
      },
      "onUpdate:open": (v: boolean) => {
        if (!v) {
          resolve(false);
          cleanup();
        }
      },
    });

    render(vnode, el);
  });
}
