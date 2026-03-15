"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const HeroMesh = dynamic(() => import("@/components/three/HeroMesh"), {
  ssr: false,
});

// Pages where HeroMesh should NOT run (has its own heavy canvas)
const MESH_DISABLED_PATHS = ["/client", "/fabric-demo"];

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showMesh = !MESH_DISABLED_PATHS.some((p) => pathname.startsWith(p));

  return (
    <>
      {showMesh && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <HeroMesh />
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
