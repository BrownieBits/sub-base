'use server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function revalidate() {
    revalidatePath(`/dashboard/products/new-digital`);
}

export async function goTo(productID: string) {
    redirect(`/dashboard/products/${productID}`);
}