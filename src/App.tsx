import { figures } from "./blog-es2.0-prom/catalog"

export default function App() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <main className="mx-auto max-w-[1040px] px-6 pb-28">
        <div className="flex flex-col gap-6">
          {figures.map((figure, index) => (
            <section
              key={index}
              className="overflow-x-auto rounded-xl border border-medium-gray bg-white p-7 sm:p-9"
            >
              <div className="min-w-[720px]">{figure}</div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
