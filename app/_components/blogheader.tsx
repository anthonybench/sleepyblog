import Image from "next/image";
import { dateFormatter } from "../_lib/dateformatter";

type Props = {
  title: string;
  coverImage: string;
  date: Date;
};

export function BlogHeader({ title, coverImage, date }: Props) {
  const formattedDate = dateFormatter(date)
  console.log(`${coverImage}`)
  return (
    <>
      <h1 className={`text-4xl`}>{title}</h1>
      <div className="">
        <Image
          src={coverImage}
          width={150} // width & height must have an aspect ratio identical to source image
          height={150}
          alt="SleepyBoy typing on laptop"
        />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-lg">
          {formattedDate}
        </div>
      </div>
    </>
  );
}
