import { MoreVertical, Trash } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "./ui/use-toast";


export function FileCardActions ({ file }: { file: Doc<"files">}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const deleteFile = useMutation(api.files.deleteFile)
  const { toast } = useToast()

  return (
    <>
      <AlertDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar este archivo, esta acción no se puede deshacer.
              Asegúrate de que realmente es lo que quieres hacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id
                })
                toast({
                  variant: 'success',
                  title: 'Archivo eliminado',
                  description: 'El archivo se eliminó correctamente',
                })
              }}
            >Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className=" w-4 h-4 top-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='text-destructive focus:text-destructive'
            onClick={() => setIsConfirmOpen(true)}
          >
            <Trash className="w-5 h-5 mr-2" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function FileCard({ file }: { file: Doc<"files">}) {
  return (
    <Card>
      <CardHeader
        className="relative"
      >
        <CardTitle>{file.name}</CardTitle>
        <div
          className="absolute top-2 right-2"
        >
          <FileCardActions
            file={file}
          />
        </div>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>
          Descargar
        </Button>
      </CardFooter>
    </Card>
  )
}