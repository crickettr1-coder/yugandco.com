const drawings=[
 '<rect x="18" y="12" width="31" height="40" rx="7"/><path d="M25 24h17M25 31h10M25 38h6"/><circle cx="44" cy="42" r="12"/><path d="m53 51 9 9"/>',
 '<path d="m21 48 13-30a6 6 0 0 1 11 0l13 30a6 6 0 0 1-5 9H27a6 6 0 0 1-6-9Z"/><path d="m32 42 7-16 7 16Z"/><circle cx="24" cy="54" r="5"/>',
 '<rect x="15" y="18" width="47" height="34" rx="8"/><path d="m33 28 14 7-14 8Z"/><path d="M23 59h31M28 52v7M48 52v7"/><path d="m55 9 3 6M67 20l-6 2"/>',
 '<path d="M24 47H17a7 7 0 0 1-7-7V24a7 7 0 0 1 7-7h32a7 7 0 0 1 7 7v7"/><path d="m24 47-8 10v-11"/><rect x="29" y="31" width="34" height="23" rx="7"/><path d="m52 54 8 8v-9M19 27h25M19 35h11"/>',
 '<rect x="11" y="17" width="52" height="39" rx="7"/><path d="M11 28h52M18 23h1M25 23h1M32 23h1m-3 11-8 7 8 7m16-14 8 7-8 7M40 33l-5 16"/>',
 '<path d="m25 51 24-30 11 9-24 30-14 3Z"/><path d="m45 26 11 9M25 51l11 9M12 15v13M6 21h13M47 6v9M43 10h9M61 53v11M56 59h11"/>'
];
export function serviceIcon(index){const colors=[['#9c71e5','#eee4fc'],['#f87899','#ffedf0'],['#55c0e6','#e6f8ff'],['#ff9d69','#fff0e6'],['#61bde8','#e8f6ff'],['#a681e8','#f0e8ff']];const [color,tint]=colors[index%colors.length];return `<span class="line-icon icon-${index}" aria-hidden="true"><svg viewBox="0 0 74 74" fill="none"><circle cx="38" cy="37" r="29" fill="${tint}"/><g stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${drawings[index%drawings.length]}</g></svg></span>`;}
