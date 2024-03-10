import markdownStyles from "./markdownstyles.module.css";

type Props = {
  content: string;
};

export function BlogBody({ content }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}