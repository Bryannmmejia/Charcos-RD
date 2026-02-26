import { create } from 'zustand';

import { FloodReport } from '@/types/report';

const REPORT_TTL_MS = 2 * 60 * 60 * 1000;

interface ReportState {
  reports: FloodReport[];
  hydrateReports: (reports: FloodReport[]) => void;
  addReport: (report: FloodReport) => void;
  voteReport: (id: string, type: 'confirm' | 'reject') => void;
  pruneExpiredReports: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  hydrateReports: (reports) => set({ reports }),
  addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
  voteReport: (id, type) =>
    set((state) => ({
      reports: state.reports.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          confirms: type === 'confirm' ? item.confirms + 1 : item.confirms,
          rejects: type === 'reject' ? item.rejects + 1 : item.rejects
        };
      })
    })),
  pruneExpiredReports: () =>
    set((state) => ({
      reports: state.reports.filter((r) => Date.now() - r.createdAt < REPORT_TTL_MS)
    }))
}));
