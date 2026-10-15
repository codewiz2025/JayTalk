import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeading, useMe } from "@/components/shell";
import { Button, Field, Input, errText } from "@/components/ui";
import { transferAmount } from "@/lib/jaytalk";
import { claimAdmin, creditBucks } from "@/lib/jaytalk-api";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — JayTalk" }] }),
});

function AdminPage() {
  const me = useMe();
  const qc = useQueryClient();
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");

  if (!me.data?.isAdmin) {
    return (
      <div className="max-w-lg">
        <PageHeading title="Admin" subtitle="The first member to claim this becomes the JayTalk admin and can add Bucks after a WhatsApp payment." />
        <Button onClick={() => void claimAdmin().then(() => qc.invalidateQueries({ queryKey: ["me"] })).catch((e) => toast.error(errText(e)))}>
          Become admin
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <PageHeading title="Admin" subtitle="Add Bucks after you confirm a WhatsApp payment." />
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        const n = transferAmount(amount);
        if (!n) { toast.error("Enter a whole number of Bucks"); return; }
        void creditBucks({ data: { username: username.trim(), amount: n } })
          .then((r) => { toast.success(`Added Bucks to @${r.username}`); setAmount(""); })
          .catch((err) => toast.error(errText(err)));
      }}>
        <Field label="Username"><Input required value={username} onChange={(e) => setUsername(e.target.value)} /></Field>
        <Field label="Bucks to add"><Input required inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
        <Button type="submit">Credit Bucks</Button>
      </form>
    </div>
  );
}
