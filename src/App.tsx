import type { ReactNode } from "react";
import { Figure03Rate } from "./figures/Fig-Rate-00";
import { Figure04Collapse } from "./figures/FigTsCollapse-00";
import { Figure05BinaryJoin } from "./figures/FigJoin-00";
import { Figure06Selector } from "./figures/FigSelector-00";
import { Figure08Methodology } from "./figures/FigCompliance-00";
import { Figure09Histograms } from "./figures/FigHistograms-00";
import { Figure10Offset } from "./figures/FigOffset-00";
import { Figure12Pack } from "./figures/FigPacking-03";
import { Figure13SharedEngine } from "./figures/FigOneEngine-00";
import { Figure13bColumnar } from "./figures/FigColumnar-00";
import { Figure16NoPacking } from "./figures/FigPacking-00";
import { Figure16CopyNoPacking } from "./figures/FigPacking-01";

const figures: Array<ReactNode> = [
  <Figure03Rate />,
  <Figure04Collapse />,
  <Figure05BinaryJoin />,
  <Figure06Selector />,
  <Figure08Methodology />,
  <Figure09Histograms />,
  <Figure10Offset />,
  <Figure12Pack />,
  <Figure13SharedEngine />,
  <Figure13bColumnar />,
  <Figure16NoPacking />,
  <Figure16CopyNoPacking />,
];

export default function App() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <main className="mx-auto max-w-[1040px] px-6 pb-28">
        <div className="flex flex-col gap-6">
          {figures.map((f, i) => (
            <section
              key={i}
              className="overflow-x-auto rounded-xl border border-medium-gray bg-white p-7 sm:p-9"
            >
              <div className="min-w-[720px]">{f}</div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

