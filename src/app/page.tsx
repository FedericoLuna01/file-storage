'use client'

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "@/components/upload-button";
import { FileCard } from "@/components/file-card";

export default function Home() {
  const organization = useOrganization()
  const user = useUser()

  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')

  return (
    <main
      className="flex flex-col min-h-screen container pt-5"
    >
      <div
        className="flex items-center justify-between mb-4"
      >
        <h1
          className="text-3xl font-bold text-gray-900"
        >
          Tus archivos
        </h1>
        <UploadButton />
      </div>
      <div
        className='grid grid-cols-4 gap-4'
      >
        {
          files?.map(file => (
            <FileCard
              key={file._id}
              file={file}
            />
          ))
        }
      </div>
    </main>
  );
}
