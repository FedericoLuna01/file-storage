"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUser } from "lucide-react";
import { FileCardActions } from "./file-actions";

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, { userId });
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={userProfile?.image} alt={userProfile?.name} />
        <AvatarFallback>
          <CircleUser strokeWidth={1} className="w-7 h-7" />
        </AvatarFallback>
      </Avatar>
      <p>{userProfile?.name || "Usuario desconocido"}</p>
    </div>
  );
}

export const columns: ColumnDef<Doc<"files"> & { isFavorite: boolean }>[] = [
  {
    accessorKey: "name",
    header: "Archivo",
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "userId",
    header: "Usuario",
    cell: ({ row }) => <UserCell userId={row.original.userId} />,
  },
  {
    accessorKey: "_creationTime",
    header: "Creado",
    cell: ({ row }) => (
      <div>
        {formatRelative(new Date(row.original._creationTime), new Date(), {
          locale: es,
        })}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <FileCardActions
        file={row.original}
        isFavorite={row.original.isFavorite}
      />
    ),
  },
];
