import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Highlighter } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
      }),
      Highlight.configure({
        multicolor: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border/30 bg-muted/40">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-testid="button-bold"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-testid="button-italic"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          data-testid="button-highlight"
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none"
        data-testid="editor-testimonial-text"
      />
      <style>{`
        .tiptap {
          outline: none;
          min-height: 80px;
          padding: 0.75rem;
          font-size: 1rem;
        }
        
        .tiptap p {
          margin: 0;
        }

        .tiptap em {
          font-style: italic;
        }

        .tiptap strong {
          font-weight: 600;
        }

        .tiptap mark {
          background-color: hsl(var(--primary) / 0.3);
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
        }
      `}</style>
    </div>
  );
}
