"use client";

import dynamic from "next/dynamic";

const HeroMesh = dynamic(() => import("@/components/three/HeroMesh"), {
  ssr: false,
});

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroMesh />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
