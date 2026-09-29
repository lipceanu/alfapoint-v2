import Image from "next/image";
import { clients } from "@/content/site";

/** "Trusted by" strip pinned to the bottom of the first screen. */
export function ClientLogos({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12 ${className}`} style={style}>
      <p className="eyebrow shrink-0 text-mist">Trusted by teams at</p>
      {/* One row on every screen: compact on phones, spread out on larger screens */}
      <ul
        className="flex flex-nowrap items-center justify-between gap-2 sm:justify-start sm:gap-12 lg:flex-1 lg:justify-between"
        aria-label="Clients we have worked with"
      >
        {clients.map((client) => (
          <li key={client.name} className="shrink-0">
            <Image
              src={client.logo}
              alt={client.name}
              width={client.width}
              height={client.height}
              unoptimized
              priority
              className={`${client.sizeClass} w-auto opacity-80 transition-opacity duration-300 hover:opacity-100`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
