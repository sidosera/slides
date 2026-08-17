import type { ReactNode } from "react";
import { Figure01Frontend } from "./figures/Figure01Frontend";
import { Figure02Compilation } from "./figures/Figure02Compilation";
import { Figure03Rate } from "./figures/Figure03Rate";
import { Figure04Collapse } from "./figures/Figure04Collapse";
import { Figure05BinaryJoin } from "./figures/Figure05BinaryJoin";
import { Figure06Selector } from "./figures/Figure06Selector";
import { Figure07ApiSurface } from "./figures/Figure07ApiSurface";
import { Figure08Methodology } from "./figures/Figure08Methodology";
import { Figure09Histograms } from "./figures/Figure09Histograms";
import { Figure10Offset } from "./figures/Figure10Offset";
import { Figure11VectorMatch } from "./figures/Figure11VectorMatch";
import { Figure12Pack } from "./figures/Figure12Pack";
import { Figure12bPackExplain } from "./figures/Figure12bPackExplain";
import { Figure13SharedEngine } from "./figures/Figure13SharedEngine";
import { Figure13bColumnar } from "./figures/Figure13bColumnar";
import { Figure14PageBlocks } from "./figures/Figure14PageBlocks";
import { Figure14bPageInternals } from "./figures/Figure14bPageInternals";
import { Figure15BlockHash } from "./figures/Figure15BlockHash";
import { Figure15bBlockHashExplain } from "./figures/Figure15bBlockHashExplain";
import { Figure16NoPacking } from "./figures/Figure16NoPacking";
import { Figure16bNoPackingExplain } from "./figures/Figure16bNoPackingExplain";
import { Figure17Packing } from "./figures/Figure17Packing";
import { Figure17bPackingExplain } from "./figures/Figure17bPackingExplain";
import { Figure18RemoteWrite } from "./figures/Figure18RemoteWrite";

// Weight tags mirror the article's figure hierarchy (major / medium / light).
const figures: Array<{ node: ReactNode; weight: "major" | "medium" | "light" }> = [
  { node: <Figure01Frontend />, weight: "light" },
  { node: <Figure02Compilation />, weight: "medium" },
  { node: <Figure03Rate />, weight: "medium" },
  { node: <Figure04Collapse />, weight: "major" },
  { node: <Figure05BinaryJoin />, weight: "major" },
  { node: <Figure06Selector />, weight: "major" },
  { node: <Figure07ApiSurface />, weight: "medium" },
  { node: <Figure08Methodology />, weight: "light" },
  { node: <Figure09Histograms />, weight: "medium" },
  { node: <Figure10Offset />, weight: "light" },
  { node: <Figure11VectorMatch />, weight: "major" },
  { node: <Figure12Pack />, weight: "major" },
  { node: <Figure12bPackExplain />, weight: "light" },
  { node: <Figure13SharedEngine />, weight: "light" },
  { node: <Figure13bColumnar />, weight: "major" },
  { node: <Figure14PageBlocks />, weight: "major" },
  { node: <Figure14bPageInternals />, weight: "major" },
  { node: <Figure15BlockHash />, weight: "major" },
  { node: <Figure15bBlockHashExplain />, weight: "light" },
  { node: <Figure16NoPacking />, weight: "major" },
  { node: <Figure16bNoPackingExplain />, weight: "light" },
  { node: <Figure17Packing />, weight: "major" },
  { node: <Figure17bPackingExplain />, weight: "light" },
  { node: <Figure18RemoteWrite />, weight: "major" },
];

const weightStyle: Record<string, string> = {
  major: "text-elastic-blue",
  medium: "text-teal",
  light: "text-dark-gray",
};

export default function App() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="mx-auto max-w-[1040px] px-6 pt-16 pb-10">
        <span className="font-mono text-[11px] font-medium tracking-widest text-teal">
          ELASTIC · ENGINEERING
        </span>
        <h1 className="mt-3 text-[30px] font-bold leading-tight tracking-tight text-dark-ink sm:text-[38px]">
          PromQL in Elasticsearch
        </h1>
        <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-ink/75">
          The publication-ready figure set for the engineering write-up — a single
          diagram grammar reused across thirteen figures. Each renders as
          export-ready SVG on pure white and is meant to sit immediately after the
          section of prose it supports.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-dark-gray">
          <LegendDot color="var(--color-teal)" label="PromQL / Prometheus semantics" />
          <LegendDot color="var(--color-elastic-blue)" label="Shared Elasticsearch execution" />
          <LegendDot color="var(--color-poppy)" label="Problem / discontinuity" />
        </div>
      </header>

      <main className="mx-auto max-w-[1040px] px-6 pb-28">
        <div className="flex flex-col gap-6">
          {figures.map((f, i) => (
            <section
              key={i}
              className="overflow-x-auto rounded-xl border border-medium-gray bg-white p-7 sm:p-9"
            >
              <div className="mb-5">
                <span
                  className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${weightStyle[f.weight]}`}
                >
                  {f.weight}
                </span>
              </div>
              <div className="min-w-[720px]">{f.node}</div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
