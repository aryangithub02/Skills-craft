"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Edit, Eye } from "lucide-react"; 
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";

/**
 * Renders a Markdown editor and read-only preview with an edit/view toggle and a PDF export action.
 *
 * @param {string} content - Markdown source to display and edit.
 * @param {boolean} [isPreviewMode=false] - Optional hint for initial preview mode (not required for internal toggle).
 * @param {(next: string) => void} onChange - Callback invoked with updated Markdown when the editor content changes.
 * @return {JSX.Element} The ResumePreview component UI.
 */
export default function ResumePreview({ content, isPreviewMode = false, onChange }) { 
  const [isEditable, setIsEditable] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = async () => {
    const element = document.getElementById("resume-pdf-content");
    if (!element) return;

    // Use hidden iframe to print (better UX than popup)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const content = element.innerHTML;
    const doc = iframe.contentWindow.document;

    doc.open();
    doc.write(`
        <html>
        <head>
            <style>
                @page { margin: 0; size: auto; }
                * { box-sizing: border-box; }
                body { 
                    font-family: "Arial", "Helvetica", sans-serif; 
                    font-size: 10pt;
                    color: #000; 
                    background: #fff; 
                    padding: 15mm; 
                    margin: 0; 
                    line-height: 1.0; 
                }
                
                /* Headings */
                h1 { 
                    font-size: 20pt; 
                    font-weight: bold; 
                    border-bottom: 2px solid #000; 
                    padding-bottom: 2px; 
                    margin-bottom: 6px; 
                    text-align: left;
                }
                h2 { 
                    font-size: 13pt; 
                    font-weight: bold; 
                    border-bottom: 1px solid #000; 
                    padding-bottom: 2px; 
                    margin-top: 10px; 
                    margin-bottom: 4px; 
                    text-align: left;
                    page-break-after: avoid; 
                }
                h3 { 
                    font-size: 11pt; 
                    font-weight: bold; 
                    margin-top: 8px; 
                    margin-bottom: 0px; /* No gap between Title and Date */
                    text-align: left;
                }
                
                /* Text & Lists */
                p { 
                    margin-top: 0;
                    margin-bottom: 2px; /* Minimal gap between paragraphs */
                    text-align: left;
                }
                ul { 
                    margin-top: 2px; 
                    padding-left: 16px; 
                    margin-bottom: 6px; 
                    list-style-position: outside;
                }
                li { 
                    margin-bottom: 1px; 
                    text-align: left;
                }
                
                /* Hide empty elements */
                p:empty { display: none; }
                
                /* Links & formatting */
                a { color: #000; text-decoration: none; }
                strong { font-weight: bold; }
                
                /* Remove auto-generated header anchors/icons */
                a.anchor, .octicon-link { display: none !important; }

                .grid { display: grid; gap: 6px; }
                .grid-cols-2 { grid-template-columns: 1fr 1fr; }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `);
    doc.close();

    // Give browsers a moment to render the iframe content (images/fonts) before printing
    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        // Remove frame after a delay to ensure print dialog caught it
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000); // 1 sec delay to be safe
    }, 500);
  };

  return (
    <div className="h-full flex flex-col">
       <div className="mb-4 flex justify-between items-center px-4"> 
           <div className="font-semibold text-sm text-gray-500">
               {isEditable ? "Markdown Editor Mode" : "Preview Mode"}
           </div>
           
           <div className="flex gap-2">
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditable(!isEditable)}
                    className={isEditable ? "bg-indigo-100 text-indigo-700" : ""}
                >
                    {isEditable ? <Eye className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                    {isEditable ? "View Preview" : "Edit Markdown"}
                </Button>

                <Button variant="outline" size="sm" onClick={downloadPDF} disabled={isGenerating}>
                    <FileDown className="mr-2 h-4 w-4" /> 
                    {isGenerating ? "Generating..." : "Download PDF"}
                </Button>
           </div>
       </div>

      <div className="flex-1 overflow-y-auto w-full">
          <div className="flex justify-center p-4">
             <div className="w-full max-w-4xl">
                <MDEditor
                    value={content}
                    onChange={onChange}
                    preview={isEditable ? "edit" : "preview"}
                    hideToolbar={!isEditable}
                    height={800}
                    data-color-mode="light"
                    style={{ 
                        background: 'white', 
                        color: 'black',
                        padding: isEditable ? '20px' : '40px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                />
             </div>
          </div>

           <div className="hidden">
              <div 
                id="resume-pdf-content" 
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '20mm',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  display: 'block'
              }}>
                  <MDEditor.Markdown 
                    source={content} 
                    style={{
                        background: 'transparent',
                        color: 'inherit',
                        fontFamily: 'inherit',
                        whiteSpace: 'pre-wrap'
                    }}
                  />
              </div>
           </div>
       </div>
    </div>
  );
}