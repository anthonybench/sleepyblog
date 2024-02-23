import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { notFound } from "next/navigation";

export default function Home({ className }: { className: string }) {
  return (
    <div className={`${className}`}>
      TODO: home (blog previews)
      <p>
        Duis dolore nostrud sunt veniam. Est proident deserunt amet adipisicing
        pariatur nulla culpa sit commodo est in cupidatat. Incididunt deserunt
        id pariatur dolor sit sunt id irure voluptate nulla consectetur ullamco
        anim esse laborum. Ut quis sunt deserunt est aliquip incididunt duis
        adipisicing sit laborum. Esse sit cupidatat incididunt officia commodo
        nisi. Nulla cillum aliquip ad dolor enim mollit excepteur cillum enim
        excepteur dolor sunt dolore. Elit magna dolore ad Lorem mollit
        reprehenderit tempor proident nulla. Nulla qui amet laborum. Laborum
        aliqua deserunt non mollit consequat fugiat cillum fugiat sit ea qui
        eiusmod quis cillum consequat. Nisi aliqua ea elit reprehenderit.
        Cupidatat occaecat Lorem fugiat non ipsum et et dolore amet. Aute sunt
        velit eu et velit duis esse exercitation commodo cupidatat aute veniam
        reprehenderit nisi. Sunt reprehenderit commodo aliquip aute sit
        voluptate sint elit deserunt. Commodo cupidatat veniam dolore dolore
        velit laboris quis pariatur aliqua. Aliquip est eiusmod enim
        exercitation deserunt mollit do duis aliqua. Ut id culpa tempor fugiat
        qui aute amet pariatur ea ullamco cillum. Dolore aliquip sunt aliquip
        officia. Do dolor excepteur eu. Lorem ea id ipsum ullamco excepteur
        nulla deserunt enim laborum dolor non est non et dolore. Cillum tempor
        proident proident amet ad ea eiusmod irure. Anim duis ut commodo quis.
        Voluptate nisi excepteur labore adipisicing ea nisi aliquip nostrud ut
        qui pariatur culpa laborum tempor. Mollit voluptate voluptate sit ut id
        consectetur officia deserunt consequat amet. Dolore anim quis quis
        voluptate minim ullamco. Amet nostrud voluptate dolore sit eu
        exercitation quis excepteur. Adipisicing elit irure deserunt irure
        pariatur cupidatat ea quis dolore commodo elit labore. Fugiat Lorem sint
        occaecat. Duis id id aute Lorem do commodo. Ut labore ad commodo duis
        officia irure qui. Nulla adipisicing nisi veniam quis adipisicing qui
        tempor incididunt aliqua aliqua mollit duis commodo. Pariatur labore
        enim eiusmod aute esse laboris deserunt elit nisi consequat Lorem magna
        est est. Nostrud ipsum est cupidatat dolor est. Culpa ipsum esse quis
        Lorem occaecat culpa voluptate in incididunt elit eu tempor excepteur
        voluptate. Consectetur do laborum quis sit adipisicing cillum aliqua. Ut
        laborum ad exercitation magna sit irure officia occaecat reprehenderit
        magna amet dolore aute dolor. Minim mollit magna cillum proident
        pariatur ut. Pariatur et fugiat mollit occaecat laborum nostrud labore
        reprehenderit officia id aliqua ut. Anim laboris pariatur ad est
        occaecat ex. Adipisicing irure deserunt incididunt adipisicing proident
        irure pariatur non mollit aliquip sint ipsum ea amet. Occaecat
        exercitation commodo eu dolor culpa duis sint aliqua mollit. Pariatur eu
        qui sint proident laboris proident sunt exercitation velit ipsum
        consectetur cupidatat deserunt culpa tempor. Deserunt tempor tempor
        laboris dolore dolor. Sint consequat velit excepteur id et. Aliquip
        proident enim et laboris duis cupidatat non aliqua exercitation aliqua
        fugiat. Est qui quis consequat ad nisi reprehenderit sunt proident
        nostrud eiusmod esse nulla magna. Veniam sit velit exercitation
        cupidatat cillum mollit mollit consectetur nisi ipsum ullamco commodo ea
        ut. Id minim reprehenderit sit deserunt esse enim occaecat duis eiusmod
        elit exercitation amet ullamco consectetur. Aute officia qui consequat
        voluptate tempor commodo pariatur laborum esse aliqua sunt deserunt duis
        enim aliquip. Occaecat fugiat sint et est voluptate ea reprehenderit.
        Dolore Lorem dolore cillum incididunt aliqua deserunt laborum mollit
        consectetur. Ex aliquip ullamco irure est deserunt. Commodo elit nostrud
        amet minim velit dolore. Cupidatat sunt proident elit aliqua nulla amet.
        Nulla sint voluptate voluptate nostrud sint. Enim do anim consectetur
        magna eu adipisicing veniam ipsum Lorem Lorem anim minim ut qui minim.
        Ad ea esse do ad consequat commodo. Occaecat est id est culpa qui
        commodo culpa esse nulla. Laborum dolore quis irure incididunt enim
        dolore. Commodo commodo amet ullamco sunt. Occaecat laboris ullamco amet
        velit ut consectetur ex commodo est fugiat. Quis pariatur dolore amet do
        ea consectetur commodo do dolor quis mollit. Anim nulla Lorem fugiat
        quis sit ut anim duis cupidatat. Proident non cillum sit nisi.
      </p>
    </div>
  );
}
