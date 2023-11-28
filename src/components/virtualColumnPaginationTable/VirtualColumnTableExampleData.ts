export const getVirtualColumnTableExampleData = (arraySize: number, columnSize: number) => {
  const data = [];
  
  for (let i = 0; i < arraySize; i++) {
    const row: any = {
      no: i + 1,
      deleted: false
    };
    
      for (let j = 1; j <= columnSize; j++) {
        row[`status::${j}`] = {
          label: `data ${i + 1} - ${j}`
        };
      }
      
      data.push(row);
  }
  
  return data;
};
