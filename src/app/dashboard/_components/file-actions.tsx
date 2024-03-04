import { Download, MoreVertical, Star, Trash, Undo2 } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Protect } from "@clerk/nextjs";
import { getFileUrl } from "./file-card";

export function FileCardActions({
  file,
  isFavorite,
}: {
  file: Doc<"files">;
  isFavorite?: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const { toast } = useToast();

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de marcar un archivo para eliminar. Después de 1
              minuto el archivo no se podrá recuperar. Asegúrate de que
              realmente es lo que quieres hacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });
                toast({
                  variant: "success",
                  title: "Archivo marcado para ser eliminado",
                  description:
                    "El archivo fue movido a la papelera, va a ser eliminado pronto.",
                });
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2">
          <MoreVertical className="w-4 h-4 top-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              window.open(getFileUrl(file.fileId));
            }}
          >
            <Download className="w-5 h-5 mr-2" /> Descargar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({ fileId: file._id });
            }}
          >
            <Star
              className={cn("w-5 h-5 mr-2", {
                "text-yellow-500 fill-yellow-500": isFavorite,
              })}
            />{" "}
            {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={null}>
            <DropdownMenuSeparator />
            {file.shouldDelete ? (
              <DropdownMenuItem
                onClick={() => restoreFile({ fileId: file._id })}
                className="text-success focus:text-success"
              >
                <Undo2 className="w-5 h-5 mr-2" /> Restaurar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsConfirmOpen(true)}
              >
                <Trash className="w-5 h-5 mr-2" /> Eliminar
              </DropdownMenuItem>
            )}
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
