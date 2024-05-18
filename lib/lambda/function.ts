export const handler = async (event: any): Promise<{}> => {
  event.Records.forEach((record: any) => {
    const { body } = record;
    console.log(body);
  });
  return {};
};
