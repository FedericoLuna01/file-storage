'use client'

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadButton } from "@/app/dashboard/_components/upload-button";
import { FileCard } from "@/app/dashboard/_components/file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/app/dashboard/_components/search-bar";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";

function Placeholder () {
  return (
    <div
      className='flex flex-col items-center justify-center text-center mt-24 gap-4'
    >
      <Image
        alt='an image of a person looking for files in a shell'
        height={250}
        width={250}
        src='/empty-state.svg'
      />
      <p className="text-2xl max-w-md">Todavía no tienes archivos, prueba subiendo uno.</p>
      <UploadButton />
    </div>
  )
}

export function FileBrowser({ title, favorites }: {title: string, favorites?: boolean}) {
  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState<string>("")

  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query, favorites } : 'skip')

  const isLoading = files === undefined

  return (
    <div
      className="w-full"
    >
      {
        isLoading && (
          <div
            className='flex flex-col items-center justify-center mt-32 gap-4'
          >
            <Loader2 className="h-32 w-32 animate-spin text-zinc-700" />
            <p className="text-2xl">Cargando tus archivos...</p>
          </div>
        )
      }
      {
        !isLoading &&  (
          <>
            <div
              className="flex items-center justify-between mb-4"
            >
              <h1
                className="text-3xl font-bold text-gray-900"
              >
                {title}
              </h1>
              <SearchBar
                query={query}
                setQuery={setQuery}
              />
              <UploadButton />
            </div>
            {
              files.length === 0 && <Placeholder />
            }
            <div
              className='grid grid-cols-3 gap-4'
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
          </>
        )
      }
    </div>
  );
}
