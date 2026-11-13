import { redirect } from "next/navigation";

/** Compatibilité des anciens liens partagés et des notifications en cache. */
export default async function LegacyPatientMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string | string[] }>;
}) {
  const params = await searchParams;
  const id = Array.isArray(params.conversation) ? params.conversation[0] : params.conversation;
  const query = new URLSearchParams({ activeContent: "messages" });
  if (id) query.set("conversation", id);
  redirect(`/patient/profil?${query.toString()}`);
}
