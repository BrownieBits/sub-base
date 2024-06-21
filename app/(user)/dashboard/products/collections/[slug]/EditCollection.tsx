'use client';

import Link from 'next/link';
import {
  DocumentData,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import AddProductsToCollectionForm from '@/components/amaze-ui/AddProductToCollectionForm';
import { db } from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faEllipsis,
  faTrash,
  faSave,
  faPencil,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { redirect, useRouter } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { revalidate } from './actions';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Collection name must be 3 or more characters long' })
    .max(18, {
      message: 'Collection name must be no more than 18 characters long',
    }),
  type: z.enum(['Manual', 'Smart'], {
    required_error: 'You need to select a collection type.',
  }),
  description: z.string(),
  tags: z.string().optional(),
});

export default function Edit(props: { data: DocumentData; id: string }) {
  const blogsRef = collection(db, 'products');
  const q = query(blogsRef, where('store_id', '==', props.id));
  const [blogSnapShots, loading1] = useCollection(q);
  const { push } = useRouter();
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [selectedName, setSelectedName] = React.useState<string>('');
  const [selectedDescription, setSelectedDescription] =
    React.useState<string>('');
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [selectedTags, setSelectedTags] = React.useState<string>('');
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.data.name || '',
      type: props.data.type || 'Manual',
      description: props.data.description || '',
      tags: props.data.tags || '',
    },
  });

  async function onSubmit() {
    const docRef: DocumentReference = doc(db, 'collections', props.id);
    setDisabled(true);
    console.log(selectedTags);
    await updateDoc(docRef, {
      name: selectedName,
      type: selectedType,
      products: selectedProducts,
      description: selectedDescription,
      tags: selectedTags,
    });
    toast('Colletion Updated', {
      description: `The ${selectedName} was updated.`,
    });
    revalidate(props.id);
  }
  async function deleteCollection() {
    const docRef: DocumentReference = doc(db, 'collections', props.id);
    await deleteDoc(docRef);
    push(`/dashboard/products/collections`);
  }
  async function collectionStatusUpdate(action: string) {
    const docRef: DocumentReference = doc(db, 'collections', props.id);
    await updateDoc(docRef, {
      status: action,
    });
    revalidate(props.id);
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
      event.target.name! === 'tags'
    ) {
      setSelectedTags(event.target.value);
    } else if (event !== null && (event === 'Manual' || event === 'Smart')) {
      if (event === 'Manual') {
        form.setValue('tags', '');
        setSelectedTags('');
      } else {
        form.setValue('tags', props.data.tags);
        setSelectedTags(props.data.tags);
      }
      setSelectedType(event);
    }
  }
  async function updateSave() {
    if (
      selectedName !== props.data.name ||
      selectedDescription !== props.data.description ||
      selectedTags !== props.data.tags ||
      selectedProducts !== props.data.products ||
      selectedType !== props.data.type
    ) {
      setDisabled(false);
    } else if (
      selectedName === props.data.name &&
      selectedDescription === props.data.description &&
      selectedTags === props.data.tags &&
      selectedProducts === props.data.products &&
      selectedType === props.data.type
    ) {
      setDisabled(true);
    }
  }
  function closeModal(updatedProducts: string[]) {
    setOpen(false);
    setSelectedProducts(updatedProducts);
  }

  React.useEffect(() => {
    form.setValue('name', props.data.name);
    setSelectedName(props.data.name);
  }, [props.data.name]);
  React.useEffect(() => {
    form.setValue('description', props.data.description);
    setSelectedDescription(props.data.description);
  }, [props.data.description]);
  React.useEffect(() => {
    form.setValue('tags', props.data.tags);
    setSelectedTags(props.data.tags);
  }, [props.data.tags]);
  React.useEffect(() => {
    form.setValue('type', props.data.type);
    setSelectedType(props.data.type);
  }, [props.data.type]);
  React.useEffect(() => {
    setSelectedProducts(props.data.products);
  }, [props.data.products]);
  React.useEffect(() => {
    updateSave();
  }, [
    selectedProducts,
    selectedType,
    selectedName,
    selectedDescription,
    selectedTags,
  ]);

  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] pt-[30px] gap-[15px]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/products">
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/products/collections">
                  Collections
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{props.data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
        <section className="flex w-full justify-between items-center px-[15px] pt-[10px] pb-[30px] gap-[15px]">
          <h1>{props.data.name}</h1>
          <div className="flex gap-[15px] items-center">
            {disabled ? (
              <></>
            ) : (
              <Button type="submit" onClick={onSubmit} asChild>
                <div>
                  <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                  Save
                </div>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/store/${props.id}/collection/${props.id}`}>
                View Collection
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FontAwesomeIcon className="icon" icon={faEllipsis} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  {props.data.status == 'Private' ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        {
                          collectionStatusUpdate('Public');
                        }
                      }}
                      asChild
                    >
                      <div>
                        <FontAwesomeIcon
                          className="icon mr-[5px]"
                          icon={faEye}
                        />{' '}
                        Make Public
                      </div>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        {
                          collectionStatusUpdate('Private');
                        }
                      }}
                      asChild
                    >
                      <div>
                        <FontAwesomeIcon
                          className="icon mr-[5px]"
                          icon={faEyeSlash}
                        />{' '}
                        Make Private
                      </div>
                    </Button>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant="ghost" onClick={deleteCollection} asChild>
                    <div>
                      <FontAwesomeIcon
                        className="icon mr-[5px]"
                        icon={faTrash}
                      />{' '}
                      Delete
                    </div>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex flex-col px-[15px] pt-[15px] pb-[30px] w-full gap-[30px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <section className="flex flex-col md:flex-row gap-[30px]">
                <aside className="w-full md:w-[400px] lg:w-[600px]">
                  <p className="pb-[15px]">
                    <b>Title and meta description</b>
                  </p>
                  <p>
                    The title and meta description help define how your
                    collection shows up on search engines.
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
                            placeholder="Tell us a little bit about this collection..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Collection Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={updateForm}
                            defaultValue={field.value}
                            className="flex  items-center space-x-6"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Manual" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Manual
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Smart" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Smart
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </aside>
              </section>
              {selectedType === 'Manual' ? (
                <></>
              ) : (
                <section className="flex flex-col md:flex-row gap-[30px] pt-[30px]">
                  <aside className="w-full md:w-[400px] lg:w-[600px]">
                    <p className="pb-[15px]">
                      <b>Smart Collection Tags</b>
                    </p>
                    <p>
                      Based on the tags in here we will build out the collection
                      of products for you.
                    </p>
                  </aside>
                  <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input
                              onChangeCapture={updateForm}
                              id="tags"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </aside>
                </section>
              )}
            </form>
          </Form>
          <section className="flex flex-col md:flex-row gap-[30px]">
            <aside className="w-full md:w-[400px] lg:w-[600px]">
              <p className="pb-[15px]">
                <b>Products</b>
              </p>
              <p className="pb-[15px]">
                This will be the products in the collection
              </p>
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger>
                  <Button variant="outline" asChild>
                    <div>
                      <FontAwesomeIcon className="icon mr-2" icon={faPencil} />
                      Edit Products
                    </div>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Select Products</AlertDialogTitle>
                    <Separator className="mb-[15px]" />
                    <AlertDialogDescription>
                      <AddProductsToCollectionForm
                        closeModal={closeModal}
                        preselected={selectedProducts}
                        products={blogSnapShots!}
                        loading={loading1}
                      />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
            </aside>
            <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
              {loading1 ? (
                <div>Loading</div>
              ) : (
                <section className="flex flex-col gap-[15px]">
                  {blogSnapShots?.docs?.length! > 0 ? (
                    <>
                      {blogSnapShots?.docs.map((doc) => {
                        if (!selectedProducts?.includes(doc.id)) {
                          return <></>;
                        }
                        return (
                          <section
                            className="flex items-center gap-[15px]"
                            key={doc.id}
                          >
                            <div className="w-[50px]">
                              <Image
                                alt={doc.data().title}
                                src={doc
                                  .data()
                                  .images[0].replace('800/800', '50/50')}
                                width="50"
                                height="50"
                              />
                            </div>
                            <span className="flex-1">{doc.data().title}</span>
                            <span className="flex-1">{doc.data().type}</span>
                            {doc.data().status === 'Public' ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                {doc.data().status}
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                {doc.data().status}
                              </span>
                            )}
                          </section>
                        );
                      })}
                    </>
                  ) : (
                    <div>No Data</div>
                  )}
                </section>
              )}
            </aside>
          </section>
        </section>
      </section>
    </section>
  );
}
