import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';

import { db } from '@/services/firebase';
import { FloodReport } from '@/types/report';

const reportsCollection = collection(db, 'floodReports');
const REPORT_TTL_MS = 2 * 60 * 60 * 1000;

export const subscribeReports = (onData: (reports: FloodReport[]) => void) => {
  const q = query(reportsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs
      .map((snapshotDoc) => {
        const data = snapshotDoc.data() as Omit<FloodReport, 'id'>;
        return {
          id: snapshotDoc.id,
          ...data,
          createdAt: data.createdAt ?? Date.now()
        };
      })
      .filter((report) => Date.now() - report.createdAt < REPORT_TTL_MS);

    onData(reports);
  });
};

export const createReport = async (
  report: Omit<FloodReport, 'id' | 'createdAt' | 'confirms' | 'rejects'>
) => {
  await addDoc(reportsCollection, {
    ...report,
    createdAt: Date.now(),
    confirms: 0,
    rejects: 0
  });
};

export const voteOnReport = async (
  reportId: string,
  type: 'confirm' | 'reject',
  current: { confirms: number; rejects: number }
) => {
  const reportRef = doc(db, 'floodReports', reportId);
  await updateDoc(reportRef, {
    confirms: type === 'confirm' ? current.confirms + 1 : current.confirms,
    rejects: type === 'reject' ? current.rejects + 1 : current.rejects
  });
};
