export interface KeyableMember {
  id?: string;
  email?: string;
  uuid?: string;
  name: string;
  initials?: string;
}

/** Chave estável para listas de membros/participantes — nunca usar apenas initials. */
export function resolveMemberKey(member: KeyableMember, index: number): string {
  if (member.id) return String(member.id);
  if (member.email) return member.email;
  if (member.uuid) return String(member.uuid);
  if (member.name) return `${member.name}-${index}`;
  return `member-${index}`;
}
