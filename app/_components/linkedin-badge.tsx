// "use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Script from "next/script";
// 1st party
import { ThemeContext } from "../_lib/themes";

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export function LinkedInBadgeLight() {
  return (
    <>
      <Script
        strategy="beforeInteractive"
        src="https://platform.linkedin.com/badges/js/profile.js"
      />
      <div
        className="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size="medium"
        data-theme="light"
        data-type="HORIZONTAL"
        data-vanity="anthonybench"
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link"
          href="https://www.linkedin.com/in/anthonybench?trk=profile-badge"
        ></a>
      </div>
    </>
  );
}

export function LinkedInBadgeDark() {
  return (
    <>
      <Script
        strategy="beforeInteractive"
        src="https://platform.linkedin.com/badges/js/profile.js"
      />
      <div
        className="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size="medium"
        data-theme="dark"
        data-type="HORIZONTAL"
        data-vanity="anthonybench"
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link"
          href="https://www.linkedin.com/in/anthonybench?trk=profile-badge"
        ></a>
      </div>
    </>
  );
}

/* strategy = 
  - beforeInteractive
  - afterInteractive
  - lazyOnload
  - worker

  (none fix the disappearing issue with or without "use client")
*/
