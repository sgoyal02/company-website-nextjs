export const blockToTxt=(blocks:any[])=>{
    if (!Array.isArray(blocks)) return '';
    return blocks.map((block) =>
        block.children?.map((child:any) => child.text).join(''))
        .join('\n');
}

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
