'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentReference, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import React from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from './actions';

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Store name must be 1 or more characters long' })
    .max(32, {
      message: 'Store name must be no more than 32 characters long',
    }),
  description: z.string(),
  avatar: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 1, `Maximum of 1 images are allowed.`)
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
  banner: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 1, `Maximum of 1 images are allowed.`)
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
  password_protected: z.boolean().default(false),
  password: z
    .string()
    .min(1, { message: 'Store password must be 1 or more characters long' })
    .max(32, {
      message: 'Store password must be no more than 32 characters long',
    })
    .optional(),
});

export default function EditForm(props: { storeID: string; userID: string }) {
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [selectedName, setSelectedName] = React.useState<string>('');
  const [selectedDescription, setSelectedDescription] =
    React.useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = React.useState<string>('');
  const [selectedBanner, setSelectedBanner] = React.useState<string>('');
  const [selectedProtection, setSelectedProtection] =
    React.useState<boolean>(false);
  const [selectedPassword, setSelectedPassword] = React.useState<string>('');
  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      avatar: undefined,
      banner: undefined,
      password_protected: false,
      password: '',
    },
  });

  async function onSubmit() {
    const docRef: DocumentReference = doc(db, 'stores', props.storeID);
    let avatar = selectedAvatar;
    let banner = selectedBanner;
    let avatar_fileName = '';
    let banner_fileName = '';

    setDisabled(true);
    await updateDoc(docRef, {
      name: selectedName,
      description: selectedDescription,
      avatar_url: avatar,
      avatar_filename: avatar_fileName,
      banner_url: banner,
      banner_filename: banner_fileName,
      password_protected: selectedProtection,
      password: selectedPassword,
    });
    revalidate();
    toast.success('Store Updated', {
      description: 'Your store info has been updated.',
    });
  }
  async function updateForm(event: any) {
    if (
      event !== null &&
      event.target !== undefined &&
      event.target.name! === 'name'
    ) {
      setSelectedName(event.target.value);
    } else if (
      event !== null &&
      event.target != undefined &&
      event.target.name! === 'description'
    ) {
      setSelectedDescription(event.target.value);
    } else if (
      event !== null &&
      event.target !== undefined &&
      event.target.name! === 'password'
    ) {
      setSelectedPassword(event.target.value);
    } else if (event !== null && typeof event === 'boolean') {
      setSelectedProtection(event);
    }
  }
  async function clearAvatar() {
    setSelectedAvatar('');
    const data = new DataTransfer();
    form.setValue('avatar', data.files);
  }
  async function clearBanner() {
    setSelectedBanner('');
    const data = new DataTransfer();
    form.setValue('banner', data.files);
  }

  React.useEffect(() => {
    const updateSave = async () => {
      setDisabled(true);
    };
    updateSave();
  }, [
    selectedName,
    selectedDescription,
    selectedAvatar,
    selectedBanner,
    selectedProtection,
    selectedPassword,
  ]);

  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Add Product</h1>
          <div className="flex gap-[15px] items-center">
            {disabled ? (
              <></>
            ) : (
              <Button type="submit" onClick={onSubmit} asChild>
                <div>
                  <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                  Create
                </div>
              </Button>
            )}
          </div>
        </section>
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col px-[15px] py-[30px] w-full gap-[30px]"
          >
            <section className="flex flex-col md:flex-row gap-[30px]">
              <aside className="w-full md:w-[400px] lg:w-[600px]">
                <p className="pb-[15px]">
                  <b>Title and meta description</b>
                </p>
                <p>
                  The title and meta description help define how your store
                  shows up on search engines.
                </p>
              </aside>
              <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={updateForm}
                          id="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          onChangeCapture={updateForm}
                          placeholder="Tell us a little bit about this store..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </aside>
            </section>

            <section className="flex flex-col md:flex-row gap-[30px]">
              <aside className="w-full md:w-[400px] lg:w-[600px]">
                <p className="pb-[15px]">
                  <b>Avatar and Store Banner</b>
                </p>
                <p>
                  The avatar and store banner help create and show off your
                  brand and personality.
                </p>
              </aside>
              <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('avatar');

                    return (
                      <FormItem className="w-full">
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          {selectedAvatar ? (
                            <section className="flex items-center gap-[30px]">
                              <Avatar className="h-[150px] w-[150px]">
                                <AvatarImage
                                  src={selectedAvatar}
                                  alt={selectedName}
                                />
                              </Avatar>
                              <Button
                                asChild
                                variant="destructive"
                                onClick={clearAvatar}
                              >
                                <FontAwesomeIcon
                                  className="icon"
                                  icon={faTrash}
                                />
                              </Button>
                            </section>
                          ) : (
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
                                Array.from(event.target.files!).forEach(
                                  (image) => dataTransfer.items.add(image)
                                );

                                // Validate and update uploaded file
                                const newFiles = dataTransfer.files;

                                const [file] = newFiles;
                                if (file) {
                                  setSelectedAvatar(URL.createObjectURL(file));
                                }
                                onChange(newFiles);
                              }}
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          For best results we suggest an image that is 300x300
                          pixels.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('banner');

                    return (
                      <FormItem className="w-full">
                        <FormLabel>Store Banner</FormLabel>
                        <FormControl>
                          {selectedBanner ? (
                            <section className="w-full flex items-center gap-[30px]">
                              <section className="flex flex1">
                                <Image
                                  src={selectedBanner}
                                  alt={selectedName}
                                  width={3096}
                                  height={526}
                                  style={{ width: '100%', height: 'auto' }}
                                ></Image>
                              </section>
                              <section>
                                <Button
                                  asChild
                                  variant="destructive"
                                  onClick={clearBanner}
                                >
                                  <FontAwesomeIcon
                                    className="icon"
                                    icon={faTrash}
                                  />
                                </Button>
                              </section>
                            </section>
                          ) : (
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
                                Array.from(event.target.files!).forEach(
                                  (image) => dataTransfer.items.add(image)
                                );

                                // Validate and update uploaded file
                                const newFiles = dataTransfer.files;

                                const [file] = newFiles;
                                if (file) {
                                  setSelectedBanner(URL.createObjectURL(file));
                                }
                                onChange(newFiles);
                              }}
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          For best results we suggest an image that is 3096x526
                          pixels.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </aside>
            </section>

            <section className="flex flex-col md:flex-row gap-[30px]">
              <aside className="w-full md:w-[400px] lg:w-[600px]">
                <p className="pb-[15px]">
                  <b>Restrict Store Access</b>
                </p>
                <p>Limit who can access your online store.</p>
              </aside>
              <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
                <FormField
                  control={form.control}
                  name="password_protected"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-[30px]">
                      <div className="space-y-0.5">
                        <FormLabel>Password protection</FormLabel>
                        <FormDescription>
                          Restrict access to visitors with the password
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={selectedProtection}
                          onCheckedChange={updateForm}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={updateForm}
                          id="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </aside>
            </section>
          </form>
        </Form>
      </section>
    </section>
  );
}
