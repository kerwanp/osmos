export default async function ServerComponent({ delay }: { delay: number }) {
  await new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, delay);
  });

  return <div>Server component</div>;
}
