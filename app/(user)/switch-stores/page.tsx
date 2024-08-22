import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  CollectionReference,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  getDocs,
  or,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import AcceptButton from './accept-invite';
import NewStoreForm from './new-store-form';
import SwitchButton from './switch-button';

type ReturnData = {
  my_stores: QueryDocumentSnapshot<DocumentData, DocumentData>[];
  team_stores: QueryDocumentSnapshot<DocumentData, DocumentData>[];
  invited_stores: QueryDocumentSnapshot<DocumentData, DocumentData>[];
};
async function getData(user_id: { [key: string]: string } | undefined) {
  const storesRef: CollectionReference = collection(db, 'stores');
  const q = query(
    storesRef,
    or(
      where('owner_id', '==', user_id?.value),
      where('users_list', 'array-contains', user_id?.value)
    )
  );
  const storesData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  const myStores: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
  const teamStores: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
  const invitedStores: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
  storesData.docs.map((doc) => {
    if (doc.data().owner_id === user_id?.value) {
      myStores.push(doc);
      return;
    } else {
      const team_filtered = doc
        .data()
        .users.filter(
          (item: any) => item.id === user_id?.value && item.status === 'Active'
        );
      const invite_filtered = doc
        .data()
        .users.filter(
          (item: any) => item.id === user_id?.value && item.status === 'Invited'
        );
      if (team_filtered.length > 0) {
        teamStores.push(doc);
        return;
      } else if (invite_filtered.length > 0) {
        invitedStores.push(doc);
        return;
      }
    }
    return;
  });
  return {
    my_stores: myStores,
    team_stores: teamStores,
    invited_stores: invitedStores,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Switch Stores`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/switch-stores/`,
      title: `Switch Stores`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',

      title: `Switch Stores`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function SwitchStores() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  const default_store = cookieStore.get('default_store');
  const data: ReturnData = await getData(user_id);

  async function revalidate() {
    'use server';
    revalidatePath(`/switch-stores`);
  }

  return (
    <>
      <section className="w-full max-w-[1754px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Stores</h1>
          <NewStoreForm userID={user_id?.value!} />
        </section>
        <HeroBanner page_slug="creator-switch-store" />
      </section>
      <Separator />
      <section className="w-full max-w-[1754px] mx-auto">
        <section className="flex flex-col px-4 pt-4 pb-8 w-full gap-8">
          <section className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-[400px] lg:w-[600px]">
              <p className="pb-4">
                <b>My Stores</b>
              </p>
              <p>These are stores you have started and own.</p>
            </aside>
            <aside className="w-full flex flex1 flex-col gap-8 bg-layer-one p-8 rounded drop-shadow">
              {data.my_stores.length === 0 ? (
                <p>No Stores</p>
              ) : (
                <>
                  {data.my_stores.map((doc: any) => {
                    return (
                      <section
                        className="flex flex-col md:flex-row items-center bg-layer-two rounded-lg border p-3 shadow-sm gap-8"
                        key={doc.id}
                      >
                        <Avatar className="bg-secondary text-foreground h-[72px] w-[72px]">
                          <AvatarImage
                            src={doc.data().avatar_url}
                            alt={doc.data().name}
                          />
                          <AvatarFallback className="bg-foreground text-background border-background">
                            <b>{doc.data().name?.slice(0, 1).toUpperCase()}</b>
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-0.5">
                          <p>
                            <b>{doc.data().name}</b>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doc.data().description.substring(0, 50)}...
                          </p>
                        </div>
                        {doc.id === default_store?.value ? (
                          <></>
                        ) : (
                          <SwitchButton
                            storeID={doc.id}
                            userID={user_id?.value!}
                            revalidate={revalidate}
                          />
                        )}
                      </section>
                    );
                  })}
                </>
              )}
            </aside>
          </section>

          <section className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-[400px] lg:w-[600px]">
              <p className="pb-4">
                <b>Team Stores</b>
              </p>
              <p>
                These are stores someone elese owns but invited you to help
                manage.
              </p>
            </aside>
            <aside className="w-full flex flex1 flex-col gap-8 bg-layer-one p-8 rounded drop-shadow">
              {data.team_stores.length === 0 ? (
                <p>No Stores</p>
              ) : (
                <>
                  {data.team_stores.map((doc: any) => {
                    return (
                      <section
                        className="flex flex-col md:flex-row items-center bg-layer-two rounded-lg border p-3 shadow-sm gap-8"
                        key={doc.id}
                      >
                        <Avatar className="bg-secondary text-foreground h-[72px] w-[72px]">
                          <AvatarImage
                            src={doc.data().avatar_url}
                            alt={doc.data().name}
                          />
                          <AvatarFallback className="bg-foreground text-background border-background">
                            <b>{doc.data().name?.slice(0, 1).toUpperCase()}</b>
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-0.5">
                          <p>
                            <b>{doc.data().name}</b>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doc.data().description.substring(0, 50)}...
                          </p>
                        </div>
                        {doc.id === default_store?.value ? (
                          <></>
                        ) : (
                          <SwitchButton
                            storeID={doc.id}
                            userID={user_id?.value!}
                            revalidate={revalidate}
                          />
                        )}
                      </section>
                    );
                  })}
                </>
              )}
            </aside>
          </section>

          <section className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-[400px] lg:w-[600px]">
              <p className="pb-4">
                <b>Invites</b>
              </p>
              <p>
                These are stores you have been invited to but have not yet
                accepted.
              </p>
            </aside>
            <aside className="w-full flex flex1 flex-col gap-8 bg-layer-one p-8 rounded drop-shadow">
              {data.invited_stores.length === 0 ? (
                <p>No Stores</p>
              ) : (
                <>
                  {data.invited_stores.map((doc: any) => {
                    return (
                      <section
                        className="flex flex-col md:flex-row items-center bg-layer-two rounded-lg border p-3 shadow-sm gap-8"
                        key={doc.id}
                      >
                        <Avatar className="bg-secondary text-foreground h-[72px] w-[72px]">
                          <AvatarImage
                            src={doc.data().avatar_url}
                            alt={doc.data().name}
                          />
                          <AvatarFallback className="bg-foreground text-background border-background">
                            <b>{doc.data().name?.slice(0, 1).toUpperCase()}</b>
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-0.5">
                          <p>
                            <b>{doc.data().name}</b>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doc.data().description.substring(0, 50)}...
                          </p>
                        </div>
                        {doc.id === default_store?.value ? (
                          <></>
                        ) : (
                          <AcceptButton
                            storeID={doc.id}
                            revalidate={revalidate}
                            userID={user_id?.value!}
                            usersList={doc.data().users}
                          />
                        )}
                      </section>
                    );
                  })}
                </>
              )}
            </aside>
          </section>
        </section>
      </section>
    </>
  );
}
