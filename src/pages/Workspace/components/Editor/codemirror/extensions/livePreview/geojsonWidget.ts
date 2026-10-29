import { WidgetType } from '@codemirror/view';

type Position = number[];
interface Geometry {
  type: string;
  coordinates?: unknown;
  geometries?: Geometry[];
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const WIDTH = 640;
const HEIGHT = 260;
const PADDING = 18;

/** The geometries in any GeoJSON object: a collection, a feature or a bare
 * geometry. */
const geometriesOf = (value: unknown): Geometry[] => {
  if (!value || typeof value !== 'object') return [];
  const obj = value as Record<string, unknown>;
  if (obj.type === 'FeatureCollection' && Array.isArray(obj.features)) {
    return obj.features.flatMap(geometriesOf);
  }
  if (obj.type === 'Feature') return geometriesOf(obj.geometry);
  if (obj.type === 'GeometryCollection' && Array.isArray(obj.geometries)) {
    return (obj.geometries as unknown[]).flatMap(geometriesOf);
  }
  return typeof obj.type === 'string' && 'coordinates' in obj
    ? [obj as unknown as Geometry]
    : [];
};

const isPosition = (value: unknown): value is Position =>
  Array.isArray(value) &&
  value.length >= 2 &&
  typeof value[0] === 'number' &&
  typeof value[1] === 'number';

const allPositions = (coords: unknown): Position[] =>
  isPosition(coords)
    ? [coords]
    : Array.isArray(coords)
      ? coords.flatMap(allPositions)
      : [];

const svgEl = (tag: string, attrs: Record<string, string | number>) => {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  return el;
};

/**
 * A ```geojson block drawn as a small map, as GitHub shows one: its areas,
 * lines and points on a plain ground (no map tiles), fitted to their extent.
 */
export class GeoJsonWidget extends WidgetType {
  constructor(readonly source: string) {
    super();
  }

  eq(other: GeoJsonWidget) {
    return this.source === other.source;
  }

  toDOM() {
    const container = document.createElement('div');
    container.className = 'cm-live-geojson';

    let geometries: Geometry[];
    try {
      geometries = geometriesOf(JSON.parse(this.source));
    } catch (error) {
      container.classList.add('cm-live-geojson-error');
      container.textContent = `GeoJSON inválido: ${
        error instanceof Error ? error.message : String(error)
      }`;
      return container;
    }
    const positions = geometries.flatMap((g) => allPositions(g.coordinates));
    if (positions.length === 0) {
      container.classList.add('cm-live-geojson-error');
      container.textContent = 'GeoJSON sin geometrías';
      return container;
    }

    // Equirectangular, squeezed by the cosine of the middle latitude so
    // shapes keep their proportions; a lone point gets a little extent.
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
    positions.forEach(([lon, lat]) => {
      minX = Math.min(minX, lon);
      maxX = Math.max(maxX, lon);
      minY = Math.min(minY, lat);
      maxY = Math.max(maxY, lat);
    });
    const squeeze = Math.cos((((minY + maxY) / 2) * Math.PI) / 180) || 1;
    const extentW = (maxX - minX) * squeeze;
    const extentH = maxY - minY;
    const scale = Math.min(
      (WIDTH - PADDING * 2) / Math.max(extentW, 0.01),
      (HEIGHT - PADDING * 2) / Math.max(extentH, 0.01),
    );
    // Centered: a lone point lands in the middle
    const offsetX = (WIDTH - extentW * scale) / 2;
    const offsetY = (HEIGHT - extentH * scale) / 2;
    const project = ([lon, lat]: Position): [number, number] => [
      offsetX + (lon - minX) * squeeze * scale,
      offsetY + (maxY - lat) * scale,
    ];
    const toPoint = (p: Position) =>
      project(p)
        .map((n) => n.toFixed(1))
        .join(',');
    const ringPath = (ring: Position[]) => `M${ring.map(toPoint).join('L')}Z`;
    const linePath = (line: Position[]) => `M${line.map(toPoint).join('L')}`;

    const svg = svgEl('svg', {
      viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
      role: 'img',
      'aria-label': 'Mapa GeoJSON',
    });
    const draw = (g: Geometry) => {
      const c = g.coordinates as unknown;
      switch (g.type) {
        case 'Polygon':
          svg.appendChild(
            svgEl('path', {
              class: 'area',
              d: (c as Position[][]).map(ringPath).join(''),
              'fill-rule': 'evenodd',
            }),
          );
          break;
        case 'MultiPolygon':
          (c as Position[][][]).forEach((poly) =>
            draw({ type: 'Polygon', coordinates: poly }),
          );
          break;
        case 'LineString':
          svg.appendChild(
            svgEl('path', { class: 'line', d: linePath(c as Position[]) }),
          );
          break;
        case 'MultiLineString':
          (c as Position[][]).forEach((line) =>
            draw({ type: 'LineString', coordinates: line }),
          );
          break;
        case 'Point': {
          const [x, y] = project(c as Position);
          svg.appendChild(
            svgEl('circle', {
              class: 'point',
              cx: x.toFixed(1),
              cy: y.toFixed(1),
              r: 4.5,
            }),
          );
          break;
        }
        case 'MultiPoint':
          (c as Position[]).forEach((p) =>
            draw({ type: 'Point', coordinates: p }),
          );
          break;
      }
    };
    // Areas under lines under points
    const order = ['Polygon', 'MultiPolygon', 'LineString', 'MultiLineString'];
    [...geometries]
      .sort((a, b) => {
        const rank = (t: string) => (order.includes(t) ? order.indexOf(t) : 9);
        return rank(a.type) - rank(b.type);
      })
      .forEach(draw);

    const caption = document.createElement('div');
    caption.className = 'cm-live-geojson-caption';
    caption.textContent = `GeoJSON · ${geometries.length} ${
      geometries.length === 1 ? 'geometría' : 'geometrías'
    }`;

    container.append(svg, caption);
    return container;
  }

  ignoreEvent() {
    return false;
  }
}
