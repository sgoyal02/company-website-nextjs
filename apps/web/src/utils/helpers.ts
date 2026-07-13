import { BlocksContent} from "@strapi/blocks-react-renderer";

// export const blockToTxt=(blocks:BlocksContent)=>{
//     if (!Array.isArray(blocks)) return '';
//     return blocks.map((block) =>
//         block.children.map((child) =>{
//           if (child.type === 'text') {
//             return child.text;
//           }

//           if (child.type === 'link') {
//             return child.children.map(item =>{
//               if (item.type === "text") {
//                 return item.text;
//               }
//               return "";
//             }).join('');
//           }

//           return '';
//         }).join(''))
//         .join('\n');
// }

type TextNode = {
  type: "text";
  text: string;
};

type LinkNode = {
  type: "link";
  children: InlineNode[];
};

type InlineNode = TextNode | LinkNode;

const inlineToText = (children: InlineNode[]):string => {
  return children
    .map((child) => {
      if (child.type === "text") {
        return child.text;
      }

      if (child.type === "link") {
        return inlineToText(child.children);
      }

      return "";
    })
    .join("");
};

type ListItemNode = {
  type: "list-item";
  children: InlineNode[];
};


type ListNode = {
  type: "list";
  children: ListItemNode[];
};


type TextBlockNode = {
  type: "paragraph" | "heading" | "quote" | "code";
  children: InlineNode[];
};


type SupportedBlockNode =
  | TextBlockNode
  | ListNode;

export const blockToTxt = (blocks: BlocksContent) => {
  if (!Array.isArray(blocks)) return "";
  return (blocks as SupportedBlockNode[])
    .map((block) => {
      if (block.type === "list") {
        return block.children
          .map((item) =>
            inlineToText(item.children)
          )
          .join(" ");
      }
      if ("children" in block) {
        return inlineToText(block.children);
      }

      return "";
    })
    .join(" ");
};

export const formatDate=(dateParam: string): string=> {
  return new Date(dateParam).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const formatFulltDate= (dateParam:string): string => {
  const newDate=new Date(dateParam).toLocaleString('en-US', {
    year:'2-digit',
    month:'2-digit',
    day:'2-digit',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    hour12: true,
  });
  return newDate.replace(' at ', ' ');
}
