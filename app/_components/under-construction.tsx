//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Image from "next/image";
// 1st party
import "@/app/_lib/utils.css";

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export function UnderConstruction() {
  return (
    <Image
      src="/assets/general/sleepyboy_under_construction.gif"
      width={2048}
      height={2048}
      className="p-20"
      alt="Under Construction"
    />
  );
}
