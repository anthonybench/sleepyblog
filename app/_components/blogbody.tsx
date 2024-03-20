import markdownStyles from "./markdownstyles.module.css";

type Props = {
  content: string;
};

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
