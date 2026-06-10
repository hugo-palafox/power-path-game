// Separates the two input wire anchors on every two-input gate or empty gate slot.
// Loaded after app.js so it overrides the original routing helpers.
function getNodeDef(id){
  return (level.circuit.nodes || []).find(n => n.id === id);
}

function getInputAnchor(nodeId, inputIndex){
  const p = getP(nodeId);
  const def = getNodeDef(nodeId);
  const type = (nodeId in player) ? player[nodeId] : (def ? def.type : null);

  if (type === 'NOT') {
    return { x: p.x - 10, y: p.y };
  }

  const sep = 4;
  return {
    x: p.x - 9,
    y: p.y + (inputIndex === 0 ? -sep : sep)
  };
}

function getOutputAnchor(nodeId){
  const p = getP(nodeId);
  const def = getNodeDef(nodeId);
  const type = (nodeId in player) ? player[nodeId] : (def ? def.type : null);

  if (type === 'NOT') return { x: p.x + 14, y: p.y };
  if (type === 'NOR') return { x: p.x + 16, y: p.y };
  if (type === 'NAND') return { x: p.x + 14, y: p.y };
  if (type === 'OR' || type === 'XOR') return { x: p.x + 12, y: p.y };

  return { x: p.x + 12, y: p.y };
}

function getSourceAnchor(id){
  if (level.circuit.inputs && id in level.circuit.inputs) {
    const p = getP(id);
    return { x: p.x + 7.6, y: p.y };
  }

  return getOutputAnchor(id);
}

function wirePath(a, b){
  const dx = Math.abs(b.x - a.x);
  const mid = a.x + Math.max(4, dx * 0.45);
  return `M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`;
}

function drawWires(vals){
  for (const n of level.circuit.nodes || []) {
    n.inputs.forEach((src, idx) => {
      const sp = getSourceAnchor(src);
      const tp = getInputAnchor(n.id, idx);
      drawPath(wirePath(sp, tp), vals[src]);
    });
  }

  const out = getOutputAnchor(level.circuit.output);
  const g = level.circuit.layout.goal || { x: 86, y: 50 };
  drawPath(wirePath(out, { x: g.x - 8, y: g.y }), vals[level.circuit.output]);
}

setTimeout(() => {
  if (typeof render === 'function') render();
}, 0);
