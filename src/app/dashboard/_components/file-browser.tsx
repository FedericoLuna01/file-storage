"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadButton } from "@/app/dashboard/_components/upload-button";
import { FileCard } from "@/app/dashboard/_components/file-card";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SearchBar } from "@/app/dashboard/_components/search-bar";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24 gap-4">
      <Image
        alt="an image of a person looking for files in a shell"
        height={250}
        width={250}
        src="/empty-state.svg"
      />
      <p className="text-2xl max-w-md">
        Todavía no tienes archivos, prueba subiendo uno.
      </p>
      <UploadButton />
    </div>
  );
}

export function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState<string>("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : "skip"
  );

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorite: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div className="w-full">
      <>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <SearchBar query={query} setQuery={setQuery} />
          <UploadButton />
        </div>

        <Tabs defaultValue="grid">
          <div className="flex justify-between items-center">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">
                <GridIcon className="mr-2 w-5 h-5" />
                Cuadricula
              </TabsTrigger>
              <TabsTrigger value="table">
                <RowsIcon className="mr-2 w-5 h-5" />
                Tabla
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2 items-center">
              <Label htmlFor="type-select">Filtrar por tipo</Label>
              <Select
                value={type}
                onValueChange={(newType) => setType(newType as any)}
              >
                <SelectTrigger id="type-select" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="image">Imagen</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading && (
            <div className="flex flex-col items-center justify-center mt-32 gap-4">
              <Loader2 className="h-32 w-32 animate-spin text-zinc-700" />
              <p className="text-2xl">Cargando tus archivos...</p>
            </div>
          )}
          <TabsContent value="grid">
            <div className="grid grid-cols-3 gap-4 w-full">
              {modifiedFiles.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="table">
            <DataTable columns={columns} data={modifiedFiles} />
          </TabsContent>
        </Tabs>
        {files?.length === 0 && <Placeholder />}
      </>
    </div>
  );
}
