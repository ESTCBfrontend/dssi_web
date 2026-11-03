export interface AssignmentOption { id: string; name: string; description?: string; statusLabel?: string; initials?: string; disabled?: boolean }
export function validateAssignmentOptions(options: readonly AssignmentOption[]) {
  if (options.some(option => !option.id.trim() || !option.name.trim()) || new Set(options.map(option => option.id)).size !== options.length) throw new Error('O seletor requer identificadores únicos e nomes não vazios.')
}
