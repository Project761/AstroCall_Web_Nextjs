"use client";

import CreateReelForm from "./CreateReelForm";
import { PanelPageHeader, PanelCard } from "@/app/components/AstrologerPanelUi";

export default function CreateReelPage() {
  return (
    <div className="mx-auto max-w-[900px]">
      <PanelPageHeader
        title="Create Reel"
        breadcrumbs={["Dashboard", "My Reels", "Create"]}
        description="Upload a new reel to share with your audience."
      />
      <PanelCard title="Reel Details">
        <CreateReelForm />
      </PanelCard>
    </div>
  );
}
