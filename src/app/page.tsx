import { ProvidersTable } from "@/components/ProvidersTable";
import providers from "@/data/providers.json";
import { Provider } from "@/lib/types";

export default function Home() {
  // Cast strictly to ensure type compatibility if JSON inference is loose
  const data: Provider[] = providers as Provider[];

  return (
    <main className="container mx-auto py-10 px-4 md:px-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Free LLM API Resources
        </h1>
        <p className="text-xl text-muted-foreground">
          A community-curated list of free and trial LLM API providers.
        </p>
      </div>
      
      <ProvidersTable data={data} />
      
      <footer className="mt-10 text-center text-sm text-muted-foreground py-6 border-t">
        <p>
          Data extracted automatically. Verify limits on provider sites.
        </p>
      </footer>
    </main>
  );
}
