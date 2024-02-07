'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ref, getDownloadURL } from 'firebase/storage';
import { useAuthState, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth, storage } from '@/firebase';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useRouter } from 'next/navigation';

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const formSchema = z.object({
  display: z
    .string()
    .min(8, { message: 'Store Name must be 8 or more characters long' })
    .max(18, {
      message: 'Store Name must be no more than 18 characters long',
    }),
  avatar: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    ),
});

export function UploadForm() {
  const [updateProfile, updating, error] = useUpdateProfile(auth);
  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();
  const [user, loading, userError] = useAuthState(auth);
  const { push } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display: '',
      avatar: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const storageRef = ref(storage, `${user?.email}/${values.avatar[0].name}`);
    await uploadFile(storageRef, values.avatar[0], {
      contentType: values.avatar[0].type,
    });
    const downloadUrl = await getDownloadURL(storageRef);
    await updateProfile({
      displayName: values.display.toLowerCase(),
      photoURL: downloadUrl,
    });
    push(`/dashboard/${values.display.toLowerCase()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-[300px]"
      >
        <FormField
          control={form.control}
          name="display"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input placeholder="Store Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field: { onChange }, ...field }) => {
            // Get current images value (always watched updated)
            const images = form.watch('avatar');

            return (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={form.formState.isSubmitting}
                    {...field}
                    onChange={(event) => {
                      // Triggered when user uploaded a new file
                      // FileList is immutable, so we need to create a new one
                      const dataTransfer = new DataTransfer();

                      // Add old images
                      if (images) {
                        Array.from(images).forEach((image) =>
                          dataTransfer.items.add(image)
                        );
                      }

                      // Add newly uploaded images
                      Array.from(event.target.files!).forEach((image) =>
                        dataTransfer.items.add(image)
                      );

                      // Validate and update uploaded file
                      const newFiles = dataTransfer.files;
                      onChange(newFiles);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {error ? <p className="text-destructive">{error.message}</p> : <></>}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
