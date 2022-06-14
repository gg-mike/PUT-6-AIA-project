export const signum = (x: number) => (x < 0 ? -1 : 1);
export const absolute = (x: number) => (x < 0 ? -x : x);

export const drawPath = (path: SVGPathElement, startX: number, startY: number, endX: number, endY: number) => {
  let deltaX = endX - startX;
  let deltaY = endY - startY;
  if (!deltaY) return path.setAttribute("d", `m ${startX} ${startY} ${deltaX} 0`);

  let s = 20;
  let ver = deltaY > 0 ? deltaY - s * 2 : deltaY + s * 2;
  let arc = deltaY > 0 ? `${s} ${s} ${s}` : `-${s} ${s} -${s}`;
  let arcStart = `c ${s} 0 ${s} ${arc}`;
  let arcEnd = `c 0 0 0 ${arc}`;

  path.setAttribute(
    "d",
    `m ${startX} ${startY} l ${deltaX / 2 - s} 0 ${arcStart} l 0 ${ver} ${arcEnd} l ${deltaX / 2 - s} 0`
  );
};

export const connectElements = (path: SVGPathElement, startElem: HTMLDivElement, endElem: HTMLDivElement) => {
  let startCoord = {
    x: startElem.offsetLeft + startElem.offsetWidth,
    y: startElem.offsetTop + startElem.offsetHeight / 2,
  };
  let endCoord = {
    x: endElem.offsetLeft,
    y: endElem.offsetTop + endElem.offsetHeight / 2,
  };
  let startX = startCoord.x;
  let startY = startCoord.y;
  let endX = endCoord.x;
  let endY = endCoord.y;
  drawPath(path, startX, startY, endX, endY);
};
