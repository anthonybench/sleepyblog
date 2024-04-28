// next
import Image from "next/image";
// 1st party
import "@/app/_lib/utils.css";

// view
export function UnderConstruction() {
  return (
    <div className={`flex justify-center`}>
      <Image
        src="/assets/general/sleepyboy_under_construction.gif"
        width={750}
        height={750}
        className="p-20"
        alt="Under Construction"
      />
    </div>
  );
}
