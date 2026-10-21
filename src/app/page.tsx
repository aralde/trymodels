import { ProvidersTable } from "@/components/ProvidersTable";
import providers from "@/data/providers.json";
import metadata from "@/data/providers-metadata.json";
import { Provider } from "@/lib/types";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  // Cast strictly to ensure type compatibility if JSON inference is loose
  const data: Provider[] = providers as Provider[];
  const meta = metadata as { renderedContent: string };


  return (
    <main className="container mx-auto py-10 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            TryModels
          </h1>
          <p className="text-xl text-muted-foreground">
            A community-curated list of free and trial LLM API providers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="font-semibold tracking-wide">HOW TO USE</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl tracking-tight uppercase">HOW TO USE</DialogTitle>
                <DialogDescription className="sr-only">How to use the Free LLM API Resources database</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 text-sm">
                <p>
                  <strong>TryModels</strong> is a comprehensive open-source database of AI model specifications, pricing, and features.
                </p>
                <p>
                  There&apos;s no single database with information about all the available AI models. We started this as a community-contributed project to address this. We also use it internally in opencode.
                </p>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">API</h3>
                  <p className="mb-3">You can access this data through an API.</p>
                  <div className="bg-[#18181b] text-zinc-100 p-4 rounded-md font-mono text-sm overflow-x-auto shadow-inner">
                    curl <span className="text-zinc-300">https://trymodels.com/api/models</span>
                  </div>
                </div>
                
                <p>
                  Use the <strong>Model ID</strong> field to do a lookup on any model; it&apos;s the identifier used by AI SDK.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          
          <a
            href="https://github.com/aralde/trymodels"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon" title="View Source on GitHub">
              <Github className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </div>
      
      <ProvidersTable data={data} renderedContent={meta.renderedContent} />
      
    </main>
  );
}
