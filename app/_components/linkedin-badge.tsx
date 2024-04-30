// "use client";

// next
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";

// params
const altText = "LinkedIn Profile Badge";

/*
  strategy = 
  - beforeInteractive
  - afterInteractive
  - lazyOnload
  - worker

  (none fix the disappearing issue with or without "use client")
*/

// view
// export function LinkedInBadgeLight() {
//   return (
//     <>
//       <Script
//         strategy="afterInteractive"
//         src="https://platform.linkedin.com/badges/js/profile.js"
//       />
//       <div
//         className="badge-base LI-profile-badge"
//         data-locale="en_US"
//         data-size="medium"
//         data-theme="light"
//         data-type="HORIZONTAL"
//         data-vanity="anthonybench"
//         data-version="v1"
//       >
//         <a
//           className="badge-base__link LI-simple-link"
//           href="https://www.linkedin.com/in/anthonybench?trk=profile-badge"
//         ></a>
//       </div>
//     </>
//   );
// }

// export function LinkedInBadgeDark() {
//   return (
//     <>
//       <Script
//         strategy="afterInteractive"
//         src="https://platform.linkedin.com/badges/js/profile.js"
//       />
//       <div
//         className="badge-base LI-profile-badge"
//         data-locale="en_US"
//         data-size="medium"
//         data-theme="dark"
//         data-type="HORIZONTAL"
//         data-vanity="anthonybench"
//         data-version="v1"
//       >
//         <a
//           className="badge-base__link LI-simple-link"
//           href="https://www.linkedin.com/in/anthonybench?trk=profile-badge"
//         ></a>
//       </div>
//     </>
//   );
// }

export function LinkedInBadgeLight() {
  return (
    <Link href="https://linkedin.com/in/anthonybench" target="_blank">
      <Image
        src="/assets/general/linkedin_badge_light.png"
        width={284}
        height={244}
        className="inline pr-5"
        alt={altText}
      />
    </Link>
  );
}

export function LinkedInBadgeDark() {
  return (
    <Link href="https://linkedin.com/in/anthonybench" target="_blank">
      <Image
        src="/assets/general/linkedin_badge_dark.png"
        width={282}
        height={244}
        className="inline pr-5"
        alt={altText}
      />
    </Link>
  );
}
