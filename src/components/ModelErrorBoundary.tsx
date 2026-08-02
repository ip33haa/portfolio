import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ModelErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 text-center p-8">
          <div className="max-w-md">
            <p className="text-red-400 font-semibold mb-2">Failed to load 3D model</p>
            <p className="text-neutral-400 text-sm mb-4">{this.state.error.message}</p>
            <p className="text-neutral-500 text-xs">
              The model lives at <code className="text-neutral-300">public/models/SteamDeck/Steam.gltf</code>{" "}
              (needs Steam.bin + texture PNGs alongside it).
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
