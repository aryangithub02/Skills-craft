const fs = require('fs');
const path = require('path');
const { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType,
  ShadingType
} = require('docx');

const inputPath = path.join(__dirname, 'docs', 'KNOWLEDGE_TRANSFER.md');
const outputPath = path.join(__dirname, 'docs', 'SkillsCraft_Knowledge_Transfer.docx');

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found at ${inputPath}`);
  process.exit(1);
}

const markdown = fs.readFileSync(inputPath, 'utf8');

// Color Palette Constants
const COLOR_PRIMARY = "1E3A8A";    // Deep Royal Blue
const COLOR_SECONDARY = "2563EB";  // Accent Blue
const COLOR_TEXT = "1E293B";       // Slate Dark
const COLOR_MUTED = "64748B";      // Muted Slate
const COLOR_BG_CODE = "0F172A";    // Dark slate background for code
const COLOR_CODE_TEXT = "E2E8F0";  // Light code text
const COLOR_BG_TABLE_HDR = "1E3A8A"; // Dark blue table header
const COLOR_BG_ALT = "F8FAFC";     // Table alternating row background

function parseInlineFormatting(text) {
  // Regex to break text into bold, inline code, links, and normal text
  const runs = [];
  let remaining = text;

  // Simple parser for **bold**, `code`, and plain text
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.substring(lastIndex, match.index), color: COLOR_TEXT }));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      runs.push(new TextRun({ 
        text: matchedStr.slice(2, -2), 
        bold: true, 
        color: COLOR_PRIMARY 
      }));
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      runs.push(new TextRun({ 
        text: matchedStr.slice(1, -1), 
        font: "Consolas", 
        color: "D97706",
        bold: true
      }));
    } else if (matchedStr.startsWith('[')) {
      const linkTextMatch = matchedStr.match(/^\[(.*?)\]/);
      const linkText = linkTextMatch ? linkTextMatch[1] : matchedStr;
      runs.push(new TextRun({ 
        text: linkText, 
        color: COLOR_SECONDARY, 
        underline: {} 
      }));
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.substring(lastIndex), color: COLOR_TEXT }));
  }

  return runs.length > 0 ? runs : [new TextRun({ text, color: COLOR_TEXT })];
}

function convertMarkdownToDocx(mdText) {
  const lines = mdText.split(/\r?\n/);
  const children = [];

  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = "";

  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Code block handling
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        const codeText = codeBuffer.join('\n');
        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: COLOR_BG_CODE, type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
                      bottom: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
                      left: { style: BorderStyle.SINGLE, size: 12, color: COLOR_SECONDARY },
                      right: { style: BorderStyle.SINGLE, size: 4, color: "334155" }
                    },
                    children: codeBuffer.map(codeLine => new Paragraph({
                      children: [
                        new TextRun({
                          text: codeLine,
                          font: "Consolas",
                          size: 19, // ~9.5pt
                          color: COLOR_CODE_TEXT
                        })
                      ],
                      spacing: { line: 240 }
                    }))
                  })
                ]
              })
            ]
          })
        );
        children.push(new Paragraph({ spacing: { after: 120 } }));
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        // Flush any active table
        if (inTable) {
          children.push(buildDocxTable(tableRows));
          tableRows = [];
          inTable = false;
        }
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 2. Table handling
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // Check if divider line like |---|---|
      if (line.includes('---')) {
        continue; // Skip divider row
      }
      inTable = true;
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      children.push(buildDocxTable(tableRows));
      children.push(new Paragraph({ spacing: { after: 140 } }));
      tableRows = [];
      inTable = false;
    }

    // 3. Headings
    if (line.startsWith('# ')) {
      children.push(
        new Paragraph({
          text: line.substring(2).trim(),
          heading: HeadingLevel.TITLE,
          spacing: { before: 240, after: 160 },
          children: [
            new TextRun({
              text: line.substring(2).trim(),
              bold: true,
              size: 44, // 22pt
              color: COLOR_PRIMARY,
              font: "Segoe UI"
            })
          ]
        })
      );
      continue;
    }
    if (line.startsWith('## ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: line.substring(3).trim(),
              bold: true,
              size: 32, // 16pt
              color: COLOR_PRIMARY,
              font: "Segoe UI"
            })
          ]
        })
      );
      continue;
    }
    if (line.startsWith('### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: line.substring(4).trim(),
              bold: true,
              size: 26, // 13pt
              color: COLOR_SECONDARY,
              font: "Segoe UI"
            })
          ]
        })
      );
      continue;
    }

    // 4. Horizontal Rule
    if (line.trim() === '---') {
      children.push(
        new Paragraph({
          border: {
            bottom: { color: "CBD5E1", space: 1, value: "single", size: 6 }
          },
          spacing: { before: 120, after: 180 }
        })
      );
      continue;
    }

    // 5. Bullet List Items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const itemText = line.trim().substring(2).trim();
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 60 },
          children: parseInlineFormatting(itemText)
        })
      );
      continue;
    }

    // 6. Blockquote
    if (line.trim().startsWith('> ')) {
      const quoteText = line.trim().substring(2).trim();
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                  margins: { top: 100, bottom: 100, left: 140, right: 140 },
                  borders: {
                    top: { style: BorderStyle.NONE, size: 0, color: "AUTO" },
                    bottom: { style: BorderStyle.NONE, size: 0, color: "AUTO" },
                    left: { style: BorderStyle.SINGLE, size: 18, color: COLOR_PRIMARY },
                    right: { style: BorderStyle.NONE, size: 0, color: "AUTO" }
                  },
                  children: [
                    new Paragraph({
                      children: parseInlineFormatting(quoteText),
                      spacing: { before: 40, after: 40 }
                    })
                  ]
                })
              ]
            })
          ]
        })
      );
      children.push(new Paragraph({ spacing: { after: 80 } }));
      continue;
    }

    // 7. Regular Paragraph
    if (line.trim().length > 0) {
      children.push(
        new Paragraph({
          children: parseInlineFormatting(line),
          spacing: { after: 120, line: 276 } // 1.15 line spacing
        })
      );
    }
  }

  if (inTable && tableRows.length > 0) {
    children.push(buildDocxTable(tableRows));
  }

  return children;
}

function buildDocxTable(rowsData) {
  if (rowsData.length === 0) return new Paragraph({});

  const colCount = rowsData[0].length;
  const colWidth = Math.floor(100 / colCount);

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rowsData.map((rowCells, rowIndex) => {
      const isHeader = (rowIndex === 0);
      const bgFill = isHeader ? COLOR_BG_TABLE_HDR : (rowIndex % 2 === 1 ? COLOR_BG_ALT : "FFFFFF");

      return new TableRow({
        children: rowCells.map(cellText => {
          return new TableCell({
            width: { size: colWidth, type: WidthType.PERCENTAGE },
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" }
            },
            children: [
              new Paragraph({
                children: parseInlineFormatting(cellText).map(run => {
                  if (isHeader) {
                    return new TextRun({ text: run.text, bold: true, color: "FFFFFF" });
                  }
                  return run;
                }),
                spacing: { before: 40, after: 40 }
              })
            ]
          });
        })
      });
    })
  });
}

async function main() {
  console.log("📄 Reading Markdown content from docs/KNOWLEDGE_TRANSFER.md...");
  const docElements = convertMarkdownToDocx(markdown);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              bottom: 1440, // 1 inch
              left: 1440,   // 1 inch
              right: 1440   // 1 inch
            }
          }
        },
        children: docElements
      }
    ]
  });

  console.log("⚙️ Compiling into styled .docx Word document...");
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Successfully generated Knowledge Transfer Word Document at: ${outputPath}`);
}

main().catch(err => {
  console.error("❌ Error generating Docx file:", err);
  process.exit(1);
});
