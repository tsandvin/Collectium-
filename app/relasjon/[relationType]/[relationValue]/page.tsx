/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Relasjonspresentasjon redirect
 *
 * Definering / formål:
 * Redirecter lokal Next.js relasjonsrute til Collectium sin faste relasjonspresentasjon.
 *
 * Bruksområde:
 * Brukes når relasjoner som konge, periode, materiale, signatur eller produsent åpnes.
 *
 * Berørte sider / routes:
 * - /relasjon/[relationType]/[relationValue]
 * - https://collectium.no/app1/collectium-katalog-relasjon-view.html
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.relations.view
 * - relation.objects.view
 *
 * Dataretning:
 * Next.js route -> ekstern Collectium relasjonspresentasjon
 */

import { redirect } from "next/navigation";

type RelasjonPageProps = {
  params: Promise<{
    relationType: string;
    relationValue: string;
  }>;
  searchParams: Promise<{
    source_key?: string;
    object_group?: string;
  }>;
};

export default async function RelasjonPage({ params, searchParams }: RelasjonPageProps) {
  const { relationType, relationValue } = await params;
  const query = await searchParams;

  const search = new URLSearchParams();

  search.set("relation_type", relationType);
  search.set("relation_value", relationValue);

  if (query.source_key) {
    search.set("source_key", query.source_key);
  }

  if (query.object_group) {
    search.set("object_group", query.object_group);
  }

  redirect(`https://collectium.no/app1/collectium-katalog-relasjon-view.html?${search.toString()}`);
}
