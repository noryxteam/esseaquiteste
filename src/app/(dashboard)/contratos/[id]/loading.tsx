import { ContratosSkeleton } from "@/components/loaders/skeletons/ContratosSkeleton";

/** Loading leve da rota — sem overlay modal que parece travar. */
export default function ContratoDetailLoading() {
  return <ContratosSkeleton />;
}
