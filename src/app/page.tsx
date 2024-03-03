'use client'

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react";


const formSchema = z.object({
  title: z.string().min(3).max(100),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required")
})


export default function Home() {
  const organization = useOrganization()
  const user = useUser()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined
    },
  })

  const fileRef = form.register('file')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(!orgId) return

    const postUrl = await generateUploadUrl()

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0]!.type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
      })

      form.reset()

      setIsFileDialogOpen(false)

      toast({
        variant: 'success',
        title: 'Archivo subido',
        description: 'El archivo se subió correctamente',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Algo salio mal',
        description: 'No se pudo subir el archivo, intenta de nuevo.',
      })
    }

  }


  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')
  const createFile = useMutation(api.files.createFile)

  return (
    <main
      className="flex flex-col min-h-screen container pt-5"
    >
      <div
        className="flex items-center justify-between"
      >
        <h1
          className="text-3xl font-bold text-gray-900"
        >
          Tus archivos
        </h1>
        <Dialog
          open={isFileDialogOpen}
          onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen)
            form.reset()
          }}
        >
          <DialogTrigger
            asChild
          >
            <Button
            >
              Subir archivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir nuevo archivo</DialogTitle>
            </DialogHeader>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titulo</FormLabel>
                        <FormControl>
                          <Input placeholder="Algún titulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem>
                        <FormLabel>Archivo</FormLabel>
                        <FormControl>
                          <Input
                            type='file'
                            {...fileRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {
                      form.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )
                    }
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>

      </div>
      {
        files?.map(file => (
          <div
            key={file._id}
          >
            {file.name}
          </div>
        ))
      }
    </main>
  );
}
