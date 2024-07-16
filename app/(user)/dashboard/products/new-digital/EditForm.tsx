'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { currency_list } from '@/lib/CurrencyList';
import { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  faFile,
  faRefresh,
  faSave,
  faSquarePlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const currencyTypes = currency_list.map((item) => item.value);
const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Product name must be 6 or more characters long' })
    .max(32, {
      message: 'Product name must be no more than 32 characters long',
    }),
  description: z.string().optional(),
  product_images: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 6, `Maximum of 6 images are allowed.`)
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
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    ),
  digital_file: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 1, `Maximum of 1 files are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    ),
  prices: z
    .object({
      price: z.union([
        z.coerce
          .number({
            message: 'Price must be a number',
          })
          .positive({
            message: 'Price must be positive',
          }),
        z.literal(''),
      ]),
      compare_at: z
        .union([
          z.coerce
            .number({
              message: 'Compare at Price must be a number',
            })
            .positive({
              message: 'Compare at Price must be positive',
            }),
          z.literal(''),
        ])
        .optional(),
    })
    .refine(
      (data) => {
        if (data.compare_at !== undefined) {
          return data.price > data.compare_at;
        }
        return true;
      },
      {
        message: 'Compare at Price must be lower than price.',
        path: ['compare_at'], // path of error
      }
    ),
  currency: z.enum(['', ...currencyTypes], {
    required_error: 'You need to select a collection type.',
  }),
  tags: z.string().optional(),
  sku: z.string().optional(),
  is_featured: z.boolean().default(false),
});

export default function EditForm(props: { storeID: string; userID: string }) {
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const productImagesRef = React.useRef<HTMLInputElement>(null);
  const digitalFileRef = React.useRef<HTMLInputElement>(null);

  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [productImages, setProductImages] = React.useState<ProductImage[]>([]);
  const [productImageFiles, setProductImageFiles] = React.useState<File[]>([]);
  const [digitalFile, setDigitalFile] = React.useState<string>('');
  const [price, setPrice] = React.useState<number>(0.0);
  const [compareAt, setCompareAt] = React.useState<number | null>(null);
  const [currecny, setCurrency] = React.useState<string>('USD');
  const [tags, setTags] = React.useState<string[]>([]);
  const [sku, setSku] = React.useState<string>('');
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);

  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      product_images: undefined,
      digital_file: undefined,
      prices: {
        price: 0.0,
      },
      currency: 'USD',
      is_featured: false,
    },
  });

  async function onSubmit() {
    console.log('Upload Files', form.getValues('product_images'));
    // const docRef: DocumentReference = doc(db, 'stores', props.storeID);
    // let avatar = selectedAvatar;
    // let banner = selectedBanner;
    // let avatar_fileName = '';
    // let banner_fileName = '';

    // setDisabled(true);
    // await updateDoc(docRef, {
    //   name: selectedName,
    //   description: selectedDescription,
    //   avatar_url: avatar,
    //   avatar_filename: avatar_fileName,
    //   banner_url: banner,
    //   banner_filename: banner_fileName,
    //   password_protected: selectedProtection,
    //   password: selectedPassword,
    // });
    // revalidate();
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
      setName(event.target.value);
    } else if (
      event !== null &&
      event.target != undefined &&
      event.target.name! === 'description'
    ) {
      setDescription(event.target.value);
    }
    // else if (
    //   event !== null &&
    //   event.target !== undefined &&
    //   event.target.name! === 'password'
    // ) {
    //   setSelectedPassword(event.target.value);
    // } else if (event !== null && typeof event === 'boolean') {
    //   setSelectedProtection(event);
    // }
  }
  async function clearDigitalFile() {
    setDigitalFile('');
    const data = new DataTransfer();
    form.setValue('digital_file', data.files);
    digitalFileRef.current?.click();
  }

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.index === source.index) {
      return;
    }
    const element = productImages[source.index];
    const fileElement = productImageFiles[source.index];
    productImages.splice(source.index, 1);
    productImages.splice(destination.index, 0, element);
    productImageFiles.splice(source.index, 1);
    productImageFiles.splice(destination.index, 0, fileElement);
    setProductImages(productImages);
    setProductImageFiles(productImageFiles);
  }

  const removeProductImage = (index: number) => {
    productImages.splice(index, 1);
    productImageFiles.splice(index, 1);
    setProductImages(productImages);
    setProductImageFiles(productImageFiles);
  };

  React.useEffect(() => {
    const updateSave = async () => {
      if (form.formState.isValid) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    };
    updateSave();
  }, [
    name,
    description,
    productImages,
    digitalFile,
    // selectedProtection,
    // selectedPassword,
  ]);

  return (
    <section className="relative">
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Add Product</h1>
          <div className="flex gap-[15px] items-center">
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={disabled}
              asChild
            >
              <div>
                <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                Create
              </div>
            </Button>
          </div>
        </section>
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto relative">
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
                          placeholder="Tell us a little bit about this product..."
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
                  <b>Images</b>
                </p>
                <p className="pb-[15px]">
                  These will be the images used to show off your product.
                </p>
                {productImages.length <= 6 ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      form.setFocus('product_images');
                      productImagesRef.current?.click();
                    }}
                    asChild
                  >
                    <div>
                      <FontAwesomeIcon
                        className="icon mr-2"
                        icon={faSquarePlus}
                      />
                      Add Image
                    </div>
                  </Button>
                ) : (
                  <></>
                )}

                <FormField
                  control={form.control}
                  name="product_images"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('product_images');

                    return (
                      <FormItem className="pt-[15px]">
                        <FormControl>
                          <>
                            <Input
                              type="file"
                              accept="image/*"
                              hidden={true}
                              className="hidden"
                              ref={productImagesRef}
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
                                if (newFiles.length > 0) {
                                  setProductImages([
                                    ...productImages,
                                    {
                                      id: newFiles.length - 1,
                                      image: URL.createObjectURL(
                                        newFiles[newFiles.length - 1]
                                      ),
                                    },
                                  ]);
                                  setProductImageFiles([
                                    ...productImageFiles,
                                    newFiles[newFiles.length - 1],
                                  ]);
                                }
                                onChange(newFiles);
                              }}
                            />
                          </>
                        </FormControl>
                        <FormDescription>
                          For best results we suggest an image that is 1000x1000
                          pixels.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </aside>
              <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
                <DragDropContext
                  // onDragStart={}
                  // onDragUpdate={}
                  onDragEnd={onDragEnd}
                >
                  <Droppable
                    droppableId="images"
                    isDropDisabled={false}
                    isCombineEnabled={false}
                    ignoreContainerClipping={true}
                    direction="horizontal"
                  >
                    {(droppableProvided) => (
                      <>
                        {productImages.length <= 0 && (
                          <>
                            <p>
                              <b>No Images Yet</b>
                            </p>
                            <p className="text-sm">
                              Add images to show off your product.
                            </p>
                          </>
                        )}
                        <section
                          className="w-full grid grid-cols-6 gap-[30px] items-center"
                          ref={droppableProvided.innerRef}
                          {...droppableProvided.droppableProps}
                        >
                          {productImages.map((image, index) => (
                            <Draggable
                              key={image.id.toString()}
                              draggableId={image.id.toString()}
                              index={index}
                            >
                              {(draggableProvided, draggableSnapshot) => {
                                return (
                                  <section
                                    className={cn(
                                      'aspect-square cursor-pointer border rounded overflow-hidden relative group',
                                      {
                                        'bg-layer-two':
                                          !draggableSnapshot.isDragging,
                                        'bg-layer-three left-auto top-auto':
                                          draggableSnapshot.isDragging,
                                      }
                                    )}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                    ref={draggableProvided.innerRef}
                                  >
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault;
                                        removeProductImage(index);
                                      }}
                                      className="absolute top-0 right-0 hidden group-hover:block"
                                    >
                                      <p>
                                        <FontAwesomeIcon
                                          className="icon"
                                          icon={faTrash}
                                        />
                                      </p>
                                    </Button>

                                    <section className="h-full flex items-center">
                                      <Image
                                        src={image.image}
                                        alt={image.id.toString()}
                                        width={300}
                                        height={300}
                                        style={{
                                          width: '100%',
                                          height: 'auto',
                                        }}
                                      />
                                    </section>
                                  </section>
                                );
                              }}
                            </Draggable>
                          ))}
                          {droppableProvided.placeholder}
                        </section>
                      </>
                    )}
                  </Droppable>
                </DragDropContext>
              </aside>
            </section>

            <section className="flex flex-col md:flex-row gap-[30px]">
              <aside className="w-full md:w-[400px] lg:w-[600px]">
                <p className="pb-[15px]">
                  <b>Digital File</b>
                </p>
                <p className="pb-[15px]">
                  This will be the file sent to the customer once purchased.
                </p>
                {digitalFile === '' ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      form.setFocus('digital_file');
                      digitalFileRef.current?.click();
                    }}
                    asChild
                  >
                    <div>
                      <FontAwesomeIcon
                        className="icon mr-2"
                        icon={faSquarePlus}
                      />
                      Add File
                    </div>
                  </Button>
                ) : (
                  <></>
                )}

                <FormField
                  control={form.control}
                  name="digital_file"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('digital_file');

                    return (
                      <FormItem className="pt-[15px]">
                        <FormControl>
                          <>
                            <Input
                              type="file"
                              accept="image/*"
                              hidden={true}
                              className="hidden"
                              ref={digitalFileRef}
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
                                if (newFiles.length > 0) {
                                  setDigitalFile(newFiles[0].name);
                                }
                                onChange(newFiles);
                              }}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </aside>
              <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
                {digitalFile === '' ? (
                  <section className="flex flex-col">
                    <p>
                      <b>No File Yet</b>
                    </p>
                    <p className="text-sm">
                      Add a file to send to your customers.
                    </p>
                  </section>
                ) : (
                  <section className="flex items-center">
                    <section className="flex flex-col justify-center items-center">
                      <FontAwesomeIcon
                        className="icon text-9xl mb-[15px]"
                        icon={faFile}
                      />
                      <p>{digitalFile}</p>
                    </section>
                    <Button
                      asChild
                      variant="destructive"
                      onClick={clearDigitalFile}
                    >
                      <p>
                        <FontAwesomeIcon
                          className="icon text-xs"
                          icon={faRefresh}
                        />
                      </p>
                    </Button>
                  </section>
                )}
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
                <section className="w-full flex flex-col md:flex-row gap-[30px]">
                  <FormField
                    control={form.control}
                    name="prices.price"
                    render={({ field }) => (
                      <FormItem className="w-full flex1">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={updateForm}
                            id="price"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prices.compare_at"
                    render={({ field }) => (
                      <FormItem className="w-full flex1">
                        <FormLabel>Compare At Price</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={updateForm}
                            id="compare_at"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="w-full flex1">
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a currency type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currency_list.map((item) => {
                              return (
                                <SelectItem value={item.value} key={item.value}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
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
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>SKU</FormLabel>
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
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={updateForm}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                      </div>
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
