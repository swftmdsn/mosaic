import type { IconName } from '../types'

export function renderIcon(name: IconName): string {
  const paths: Record<IconName, string> = {
    arrowDown: '<path d="M12 5v14"/><path d="m18 13-6 6-6-6"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
    bookDashed: '<path d="M12 17h1.5"/><path d="M12 22h1.5"/><path d="M12 2h1.5"/><path d="M17.5 22H19a1 1 0 0 0 1-1"/><path d="M17.5 2H19a1 1 0 0 1 1 1v1.5"/><path d="M20 14v3h-2.5"/><path d="M20 8.5V10"/><path d="M4 10V8.5"/><path d="M4 19.5V14"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H8"/><path d="M8 22H6.5a1 1 0 0 1 0-5H8"/>',
    bold: '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7z"/><path d="M7 12h7a3.5 3.5 0 0 1 0 7H7z"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    command: '<path d="M18 6a3 3 0 1 0-3-3v18a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V3a3 3 0 1 0-3 3h12Z"/>',
    cornerDownRight: '<path d="M4 4v7a4 4 0 0 0 4 4h12"/><path d="m15 10 5 5-5 5"/>',
    copy: '<rect x="9" y="9" width="10" height="10" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    focus: '<rect x="5" y="5" width="14" height="14" rx="4"/><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M21 15v4a2 2 0 0 1-2 2h-4"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/>',
    focusOff: '<rect x="5" y="5" width="14" height="14" rx="4"/><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M21 15v4a2 2 0 0 1-2 2h-4"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/><path d="M4 20 20 4"/>',
    folder: '<path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v7A2.5 2.5 0 0 1 18.5 18h-13A2.5 2.5 0 0 1 3 15.5v-9Z"/>',
    grip: '<path d="M9 5h.01"/><path d="M15 5h.01"/><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M9 19h.01"/><path d="M15 19h.01"/>',
    highlighter: '<path fill="currentColor" stroke="none" d="M4.5 5h6.4v1.8H9.4v4.1h5.2V6.8h-1.5V5h6.4v1.8h-1.6v10.4h1.6V19h-6.4v-1.8h1.5v-4.4H9.4v4.4h1.5V19H4.5v-1.8h1.6V6.8H4.5V5Z"/>',
    image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="2"/><path d="m21 15-4.5-4.5L9 18"/>',
    indent: '<path d="M3 6h18"/><path d="M13 12h8"/><path d="M3 18h18"/><path d="m5 9 3 3-3 3"/>',
    italic: '<path d="M19 4h-9"/><path d="M14 20H5"/><path d="m15 4-6 16"/>',
    keyboard: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h.01"/><path d="M11 9h.01"/><path d="M15 9h.01"/><path d="M17 13h.01"/><path d="M13 13h.01"/><path d="M9 13h.01"/><path d="M7 17h10"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93"/><path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.1a5 5 0 0 0 7.07 7.07L13 19.07"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    map: '<circle cx="6" cy="6" r="2.3"/><circle cx="15" cy="10" r="2.3"/><circle cx="18" cy="18" r="2.3"/><circle cx="8" cy="18" r="2.3"/><path d="M8.2 6.8 12.9 9.2"/><path d="M15.8 12.2 17.2 15.8"/><path d="M13.3 11.4 9.7 16.2"/>',
    nodeLink: '<path d="M6 17h.01" style="stroke-width: 5"/><path d="M18 7h.01" style="stroke-width: 5"/><path d="M8.2 15.8C11 8.5 13 15.5 15.8 8.2"/>',
    moon: '<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/>',
    outdent: '<path d="M3 6h18"/><path d="M13 12h8"/><path d="M3 18h18"/><path d="m8 9-3 3 3 3"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    resize: '<path d="M15 5h4v4"/><path d="m14 10 5-5"/><path d="M5 15v4h4"/><path d="m10 14-5 5"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.1 2.1 0 1 1-2.97 2.97l-.05-.05a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21a2.1 2.1 0 1 1-4.2 0v-.08a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.05.05a2.1 2.1 0 1 1-2.97-2.97l.05-.05A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-1.66-1.1H2.86a2.1 2.1 0 1 1 0-4.2h.08A1.8 1.8 0 0 0 4.6 8.6a1.8 1.8 0 0 0-.36-1.98l-.05-.05a2.1 2.1 0 1 1 2.97-2.97l.05.05a1.8 1.8 0 0 0 1.98.36A1.8 1.8 0 0 0 10.3 2.4V2.3a2.1 2.1 0 1 1 4.2 0v.08a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.05-.05a2.1 2.1 0 1 1 2.97 2.97l-.05.05a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.66 1.1h.08a2.1 2.1 0 1 1 0 4.2h-.08A1.8 1.8 0 0 0 19.4 15Z"/>',
    strike: '<path d="M4 12h16"/><path d="M16 6.5c-.9-.9-2.2-1.5-4-1.5-2.8 0-4.5 1.3-4.5 3 0 1.2.8 2 2.3 2.5"/><path d="M8 17.5c.9.9 2.2 1.5 4 1.5 2.8 0 4.5-1.3 4.5-3 0-1.2-.8-2-2.3-2.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    underline: '<path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M4 21h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  }

  return `<svg class="icon icon-${name}" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`
}
