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
import { useRouter } from 'next/navigation';

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
});

export default function Edit(props: {
  data: DocumentData;
  id: string;
  revalidate: () => void;
  displayName: string;
}) {
  const blogsRef = collection(db, 'products');
  const q = query(blogsRef, where('store_id', '==', props.displayName));
  const [blogSnapShots, loading1] = useCollection(q);
  const { push } = useRouter();
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [selectedTitle, setSelectedTitle] = React.useState<string>('');
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.data.title || '',
      type: props.data.type || 'Manual',
    },
  });

  async function onSubmit() {
    const docRef: DocumentReference = doc(db, 'collections', props.id);
    setDisabled(true);
    await updateDoc(docRef, {
      title: selectedTitle,
      type: selectedType,
      products: selectedProducts,
    });
    props.revalidate();
    push(`/dashboard/products/collections`);
  }
  async function deleteCollection() {
    const docRef: DocumentReference = doc(db, 'collections', props.id);
    await deleteDoc(docRef);
    props.revalidate();
  }
  async function collectionStatusUpdate(action: string) {
    const docRef: DocumentReference = doc(db, 'collections', props.id);
    await updateDoc(docRef, {
      status: action,
    });
    props.revalidate();
  }
  async function updateForm(event: any) {
    if (event !== null && (event === 'Manual' || event === 'Smart')) {
      setSelectedType(event);
    } else if (event !== null && event.target.type === 'text') {
      setSelectedTitle(event.target.value);
    }
  }
  async function updateSave() {
    if (
      selectedType !== props.data.type ||
      JSON.stringify(selectedProducts) !==
        JSON.stringify(props.data.products) ||
      selectedTitle !== props.data.title
    ) {
      setDisabled(false);
    } else if (
      selectedType === props.data.type &&
      JSON.stringify(selectedProducts) ===
        JSON.stringify(props.data.products) &&
      selectedTitle === props.data.title
    ) {
      setDisabled(true);
    }
  }
  function closeModal(updatedProducts: string[]) {
    setOpen(false);
    setSelectedProducts(updatedProducts);
  }

  React.useEffect(() => {
    form.setValue('name', props.data.title);
    setSelectedTitle(props.data.title);
  }, [props.data.title]);
  React.useEffect(() => {
    form.setValue('type', props.data.type);
    setSelectedType(props.data.type);
  }, [props.data.type]);
  React.useEffect(() => {
    setSelectedProducts(props.data.products);
  }, [props.data.products]);
  React.useEffect(() => {
    updateSave();
  }, [selectedProducts, selectedType, selectedTitle]);

  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] pt-[30px] gap-[15px]">
          <Button
            variant="link"
            asChild
            className="px-0 py-0 h-auto text-foreground"
          >
            <Link href={`/dashboard/products/collections`}>
              <FontAwesomeIcon className="icon mr-[5px]" icon={faChevronLeft} />
              Collections
            </Link>
          </Button>
        </section>
        <section className="flex w-full justify-between items-center px-[15px] pt-[10px] pb-[30px] gap-[15px]">
          <h1>{props.data.title}</h1>
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
            <Button variant="outline" type="submit" onClick={onSubmit} asChild>
              <Link
                href={`http://localhost:3000/creator/collection/${props.id}`}
              >
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
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex flex-col md:flex-row justify-center px-[15px] pt-[15px] pb-[30px] w-full gap-[30px]">
          <section className="">
            <h3>Collection Details</h3>
            <Separator className="my-[10px]" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
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
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Collection Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={updateForm}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
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
                            <FormLabel className="font-normal">Smart</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </section>
          <section className="flex-1">
            <h3>Products</h3>
            <Separator className="my-[10px]" />
            <section className="flex justify-between">
              <span>
                {selectedProducts?.length || 0} Product
                {selectedProducts?.length === 1 ? '' : 's'}
              </span>
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
            </section>
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
          </section>
        </section>
      </section>
    </section>
  );
}
