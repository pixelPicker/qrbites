import { toast } from "sonner";

export function ErrorToast(error: Error) {
  toast(error.message, { className: "!bg-non-veg-red !text-woo-white" });
}
