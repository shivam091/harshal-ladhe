import type { JSX } from "react";
import { SidingRow, SidingLabel, RouteLamp, Track, Car, EmptyTrack } from "@/components/EventLoopVisualiser/Siding/Siding.styles";
import type { SidingProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// One queue drawn as a siding of rail cars — the call stack shares the component but stands upright, because a stack grows upwards rather than along a line.
export default function Siding({ title, cars, emptyLabel, tone, active }: SidingProps): JSX.Element {
  const vertical = tone === "stack";

  return (
    <>
      <SidingRow data-tone={tone}>
        <SidingLabel>
          <RouteLamp data-lit={active ? "true" : undefined} aria-hidden="true" />
          {title}
        </SidingLabel>
        <Track data-orientation={vertical ? "vertical" : undefined} aria-label={`${title}: ${cars.length === 0 ? emptyLabel : cars.map((car) => car.label).join(", ")}`}>
          {cars.length === 0 ? (
            <EmptyTrack>{emptyLabel}</EmptyTrack>
          ) : (
            cars.map((car, index) => (
              <Car key={car.id} title={car.label} data-top={vertical && index === cars.length - 1 ? "true" : undefined}>
                {car.label}
              </Car>
            ))
          )}
        </Track>
      </SidingRow>
    </>
  );
}

Siding.displayName = "Siding";
