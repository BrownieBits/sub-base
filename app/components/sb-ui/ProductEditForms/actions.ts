'use server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function revalidate(id: string) {
    revalidatePath(`/dashboard/products`);
    revalidatePath(`/dashboard/products/${id}`);
}

export async function goTo(url: string) {
    redirect(url);
}