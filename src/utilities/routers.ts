import { useRouter, type Router } from "vue-router";

export async function GoTo(name: string): Promise<void> {
  const router: Router = useRouter();

  await router.push({
    name: name,
  });
}
