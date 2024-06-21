'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/firebase';
import { DocumentReference, doc, updateDoc } from 'firebase/firestore';

export default function AcceptButton(props: {
  storeID: string;
  revalidate: () => void;
  userID: string;
  usersList: {
    id: string;
    role: string;
    status: string;
  }[];
}) {
  async function accept() {
    const docRef: DocumentReference = doc(db, 'stores', props.storeID);
    const newList = props.usersList.map((item) => {
      console.log(item.id !== props.userID);
      if (item.id !== props.userID) {
        return item;
      } else {
        return {
          id: item.id,
          role: item.role,
          status: 'Active',
        };
      }
    });
    await updateDoc(docRef, {
      users: newList,
    });
    props.revalidate();
  }

  return (
    <Button variant="outline" onClick={accept}>
      <>
        <i className="mr-2 h-4 w-4 fa-solid fa-circle-check"></i>
        Accept Invite
      </>
    </Button>
  );
}
