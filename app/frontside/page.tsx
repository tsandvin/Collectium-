import type { Metadata } from "next";
import CollectiumV5StartPage from "../../components/startside/CollectiumV5StartPage";

export const metadata: Metadata = {
  title: "Frontside · Collectium",
  description: "Collectium frontside med v5 skin- og designstyring.",
};

export default function FrontsidePage() {
  return <CollectiumV5StartPage />;
}
