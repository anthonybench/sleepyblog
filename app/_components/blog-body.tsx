//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// 1st party
import markdownStyles from "./post-styles.module.css";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
type Props = {
  content: string;
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export function BlogBody({ content }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
