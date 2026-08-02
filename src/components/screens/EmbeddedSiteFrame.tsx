import { ScreenHeader } from "./ScreenHeader";

type EmbeddedSiteFrameProps = {
  title: string;
  src: string;
};

export function EmbeddedSiteFrame({ title, src }: EmbeddedSiteFrameProps) {
  return (
    <div className="w-full h-full bg-neutral-900 flex flex-col">
      <ScreenHeader title={title} />
      <iframe
        src={src}
        title={title}
        className="flex-1 w-full border-0 bg-black"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        allow="fullscreen"
      />
    </div>
  );
}
