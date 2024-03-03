import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, Star, Trash } from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";


export function FileCardActions ({ file }: { file: Doc<"files">}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const deleteFile = useMutation(api.files.deleteFile)
  const toggleFavorite = useMutation(api.files.toggleFavorite)
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
            onClick={() => {
              toggleFavorite({ fileId: file._id })
            }}
          >
            <Star className="w-5 h-5 mr-2" /> Favoritos
          </DropdownMenuItem>
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

function getFileUrl (fileId: Id<"_storage">) {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

export function FileCard({ file }: { file: Doc<"files">}) {
  const typeIcons = {
    'image': <ImageIcon />,
    'pdf': <FileTextIcon />,
    'csv': <GanttChartIcon />
  } as Record<Doc<"files">["type"], ReactNode>

  return (
    <Card>
      <CardHeader
        className="relative"
      >
        <CardTitle
          className="flex items-center gap-2"
        >
          <div>
            {
              typeIcons[file.type]
            }
          </div>
          {file.name}
        </CardTitle>
        <div
          className="absolute top-2 right-2"
        >
          <FileCardActions
            file={file}
          />
        </div>
      </CardHeader>
      <CardContent
        className="flex justify-center items-center h-[200px]"
      >
        {
          file.type === 'image' && (
            <Image
              src={getFileUrl(file.fileId)}
              width={200}
              height={200}
              alt={file.name}
              className="rounded-md"
            />
          )
        }
        {
          file.type === 'csv' && <GanttChartIcon className="w-32 h-32" />
        }
        {
          file.type === 'pdf' && <FileTextIcon className="w-32 h-32" />
        }
      </CardContent>
      <CardFooter
        className="flex justify-center"
      >
        <Button
          onClick={() => {
            window.open(getFileUrl(file.fileId))
          }}
        >
          Descargar
        </Button>
      </CardFooter>
    </Card>
  )
}