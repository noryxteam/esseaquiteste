export function printContractDocument() {
  window.print();
}

export function downloadContractPdf() {
  window.print();
}

export async function shareContractLink(link: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(link);
    return true;
  }
  return false;
}
