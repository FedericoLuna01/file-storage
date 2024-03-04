import {
  CircleUser,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
} from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { es } from "date-fns/locale";

import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCardActions } from "./file-actions";
import { formatRelative } from "date-fns";

export function getFileUrl(fileId: Id<"_storage">) {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export function FileCard({
  file,
}: {
  file: Doc<"files"> & { isFavorite: boolean };
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-base font-normal">
          <div>{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions file={file} isFavorite={file.isFavorite} />
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-[200px]">
        {file.type === "image" && (
          <Image
            src={getFileUrl(file.fileId)}
            width={200}
            height={200}
            alt={file.name}
            className="rounded-md"
          />
        )}
        {file.type === "csv" && <GanttChartIcon className="w-32 h-32" />}
        {file.type === "pdf" && <FileTextIcon className="w-32 h-32" />}
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.image} alt={userProfile?.name} />
            <AvatarFallback>
              <CircleUser strokeWidth={1} className="w-7 h-7" />
            </AvatarFallback>
          </Avatar>
          <p>{userProfile?.name || "Usuario desconocido"}</p>
        </div>
        <div className="text-xs">
          Publicado en{" "}
          {formatRelative(new Date(file._creationTime), new Date(), {
            locale: es,
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
