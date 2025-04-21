
type ScraperKey =
  | "starTech"
  | "techLand"
  | "skyLand"
  | "ryans"
  | "pcHouse"
  | "ultra"
  | "binary"
  | "potaka";

export const scraperSources:{ key: ScraperKey; name: string }[] = [
    { key: "starTech", name: "StarTech" },
    { key: "techLand", name: "TechLand" },
    { key: "skyLand", name: "SkyLand" },
    { key: "ryans", name: "Ryans" },
    { key: "pcHouse", name: "PcHouse" },
    { key: "ultra", name: "UltraTech" },
    { key: "binary", name: "Binary" },
    { key: "potaka", name: "PotakaIT" },
  ];
  