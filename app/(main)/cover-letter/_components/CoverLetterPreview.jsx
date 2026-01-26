"use client";

import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

export default function CoverLetterPreview({ content, className }) {
    
    const downloadPDF = async () => {
        // Create a hidden div to render the markdown content strictly for PDF generation
        // parsing markdown to HTML
        const element = document.getElementById("cl-pdf-content");
        if (!element) return;

        // Use hidden iframe to print (matches Resume logic)
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const pdfContent = element.innerHTML;
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
                        padding: 20mm; 
                        margin: 0; 
                        line-height: 1.5; 
                    }
                    
                    p { 
                        margin-bottom: 12px; 
                        text-align: left;
                    }

                    /* Links & formatting */
                    a { color: #000; text-decoration: none; }
                    strong { font-weight: bold; }
                </style>
            </head>
            <body>
                ${pdfContent}
            </body>
            </html>
        `);
        doc.close();

        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);
    };

    return (
        <div className={className}>
            <div className="flex justify-end mb-4">
                 <Button variant="outline" onClick={downloadPDF}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF
                 </Button>
            </div>
            
            <div className="border bg-white p-8 rounded-sm shadow-sm min-h-[600px] text-black">
                <div className="prose max-w-none whitespace-pre-wrap font-serif text-sm leading-relaxed">
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

            {/* Hidden Container for PDF Rendering */}
            <div className="hidden">
               <div id="cl-pdf-content">
                   <MDEditor.Markdown 
                     source={content} 
                     style={{
                         background: 'transparent',
                         color: 'inherit',
                         fontFamily: 'Arial, Helvetica, sans-serif', // Force font for PDF
                         fontSize: '10pt',
                         whiteSpace: 'pre-wrap'
                     }}
                   />
               </div>
            </div>
        </div>
    );
}
