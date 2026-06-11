// Child-facing ON/OFF display override.
// Internal logic remains numeric: 1 = true, 0 = false.
function boolLabel(value){
  return Number(value) === 1 || value === true ? 'ON' : 'OFF';
}

function drawInputs(vals){
  for (const [id, v] of Object.entries(level.circuit.inputs || {})) {
    const p = getP(id);
    const actual = (id in player) ? player[id] : v;
    const missing = actual === null;
    const g = el('g', { class: 'inputGroup', transform: `translate(${p.x} ${p.y})`, 'data-slot': id });

    g.appendChild(el('text', { x: 0, y: -9, class: 'inputLabel' }, id));
    g.appendChild(el('circle', {
      cx: 0,
      cy: 0,
      r: 7.4,
      class: 'orbBase ' + (missing ? 'orbDash ' : '') + (vals[id] ? 'orbOn' : '')
    }));
    g.appendChild(el('text', { x: 0, y: 1.1, class: 'orbText ' + (vals[id] ? 'on' : '') }, missing ? '?' : boolLabel(vals[id])));
    g.onclick = () => placeSelected(id, 'input');
    svg.appendChild(g);
  }
}

function renderTray(){
  tray.innerHTML = '';
  (level.pieces || []).forEach(p => {
    const b = document.createElement('button');
    b.className = 'piece ' + (p.kind === 'input' ? 'inputPiece' : 'gatePiece');
    b.dataset.kind = p.kind;
    b.dataset.value = p.value;
    b.innerHTML = p.kind === 'input'
      ? `<span class="circle">${boolLabel(p.value)}</span>`
      : miniGate(p.value);
    b.onclick = () => selectPiece(b, p);
    b.onpointerdown = e => startDrag(e, b, p);
    tray.appendChild(b);
  });
}

setTimeout(() => {
  const hint = document.querySelector('.hint');
  if (hint) hint.innerHTML = '<span class="bulb">💡</span><span>DRAG ON/OFF INTO</span><span class="q">?</span>';
  if (typeof render === 'function') render();
}, 0);
