import type { Metadata } from "next";
import CollectiumV5StartPage from "../../components/startside/CollectiumV5StartPage";

export const metadata: Metadata = {
  title: "Startside · Collectium",
  description: "Egen Collectium startside med v5 skin- og designstyring.",
};

export default function StartsidePage() {
  return <CollectiumV5StartPage />;
}
