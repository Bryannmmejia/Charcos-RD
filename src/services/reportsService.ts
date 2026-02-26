import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';

import { db } from '@/services/firebase';
import { FloodReport } from '@/types/report';

const reportsCollection = collection(db, 'floodReports');

export const subscribeReports = (onData: (reports: FloodReport[]) => void) => {
  const q = query(reportsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<FloodReport, 'id'>;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ?? Date.now()
      };
    });
    onData(reports);
  });
};

export const createReport = async (report: Omit<FloodReport, 'id' | 'createdAt' | 'confirms' | 'rejects'>) => {
  await addDoc(reportsCollection, {
    ...report,
    createdAt: Date.now(),
    confirms: 0,
    rejects: 0
  });
};
