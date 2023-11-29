export const getVirtualColumnTableExampleData = (arraySize: number, columnSize: number) => {
  const data = [];
  
  for (let i = 1; i <= arraySize; i++) {
    const row: any = {
      no: i,
      email: `foo${i}@bar.com`,
      name: `skkim-${i}`,
      totalStatus: 'complete',
      deleted: false
    };
    
      for (let j = 1; j <= columnSize; j++) {
        row[`status::${j}`] = {
          label: `data ${i} - ${j}`
        };
      }
      
      data.push(row);
  }
  
  return data;
};

export const getVirtualColumnTableExampleHeaders = (size: number) => {
  const exampleFirstHeaders: any[] = [
    {
      id: 1,
      rowspan: 2,
      label: 'no',
      width: 65
    },
    {
      id: 2,
      rowspan: 2,
      label: 'email',
      width: 300,
    },
    {
      id: 3,
      label: 'name',
      width: 80
    },
    {
      id: 4,
      colspan: size,
      label: 'statuses'
    }
  ];
  const exampleSecondHeaders: any[] = [
    {
      id: 1,
      label: 'totalStatus',
    }
  ];
  
  for (let i = 1; i <= size; i++) {
    exampleSecondHeaders.push({
      id: i + 1,
      label: `${i}`,
    });
  }
  
  return {
    exampleFirstHeaders,
    exampleSecondHeaders
  };
};
