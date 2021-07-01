interface Data {
  name: string;
  spec: string;
  time: number;
  operationTime: number;
}

interface ISender {
  send(data: Data);
}

type FormatFunction = (data: Data) => string;
