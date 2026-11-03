export type ChecklistResult = 'pending' | 'pass' | 'fail' | 'notTested'
export interface ChecklistEntry { id: string; title: string; description?: string; result: ChecklistResult; note?: string }
export interface ChecklistItemLabels { pending: string; pass: string; fail: string; notTested: string; register: string; edit: string; result: string; evidence: string; addEvidence: string }
export const results: ChecklistResult[] = ['pending', 'pass', 'fail', 'notTested']
export function validateChecklistEntry(item: ChecklistEntry) {
  if (!item || typeof item.id !== 'string' || !item.id.trim() || typeof item.title !== 'string' || !item.title.trim() || !results.includes(item.result)) throw new Error('ChecklistItem requer id, título e resultado válidos.')
}
