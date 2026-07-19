import { Link } from "react-router-dom";
import { getAreaById } from "../../data/researchAreas";

export function AreaTag({ areaId, size = "sm" }: { areaId: string; size?: "sm" | "md" }) {
  const area = getAreaById(areaId);
  if (!area) return null;
  return (
    <Link
      to={`/research-areas/${area.slug}`}
      className={`tag ${size === "sm" ? "px-2 py-0.5" : "px-3 py-1"}`}
    >
      {area.name}
    </Link>
  );
}
