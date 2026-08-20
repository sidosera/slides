import { C } from "../palette"

export function Markers() {
  const head = (id: string, color: string) => (
    <marker
      id={id}
      key={id}
      viewBox="0 0 10 10"
      refX="8.5"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
  )

  return (
    <defs>
      {head("mk-ink", C.ink)}
      {head("mk-blue", C.blue)}
      {head("mk-gray", C.darkGray)}
      {head("mk-teal", C.teal)}
    </defs>
  )
}
